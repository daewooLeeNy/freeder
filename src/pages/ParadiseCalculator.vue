<template>
  <q-page>
    <div class="q-pa-md">
      <q-card bordered class="bg-secondary text-white">
        <q-card-section>
          <div class="text-h6 ">
            낙원이란?
          </div>

          <div class="text-subtitle2">
            일하지 않고도 원하는 생활을 할 수 있는 재정 상태를 말합니다. <br />
            예를들어, 일하지 않은 상태에서 월 500만원을 생활비로 생활하고 이
            생활비가 자본소득으로 월 500만원이 들어온다면 낙원(Paradise)
            상태입니다. (혹은 경제적자유 상태) <br />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <h4 class="q-my-md">당신의 자산 목표 금액은?</h4>
      <p>
        현재의 자산과 저축금액을 입력해서 은퇴시점에 얼마가 모아지는지
        계산해보세요. <br />
        그리고 자산/저축/은퇴시점/수익율을 조정 해가며 재정 목표치를 정해보세요.
      </p>
      <p>
        <q-btn
          color="primary"
          label="자산=2억 저축=1200 은퇴=10년후 수익율=10% 예제"
          icon-right="open_in_new"
          @click="sample = true"
        ></q-btn>
      </p>

      <div class="row q-col-gutter-xs">
        <div class="col-6 col-xl-2  input-short-won">
          <q-input
            v-model="assets"
            label="보유 자산"
            stack-label
            :dense="dense"
            suffix="만원"
            placeholder="은퇴기간 동안 자본소득을 발생 시키는 자산 금액입니다"
            @input="assets = formatNumber($event)"
          >
            <q-tooltip>현재 자산을 만원 단위로 입력해주세요.</q-tooltip>
          </q-input>
        </div>

        <div class="col-6 col-xl-2 input-short-won">
          <q-input
            v-model="yearSavingAmount"
            type="text"
            label="저축금액(연)"
            stack-label
            :dense="dense"
            suffix="만원"
            placeholder="한해 동안 저축 가능한 금액입니다"
            @input="yearSavingAmount = formatNumber($event)"
          >
            <q-tooltip
              >한해 동안 저축 가능한 금액을 만원 단위로 입력해주세요.</q-tooltip
            >
          </q-input>
        </div>

        <div class="col-4 input-short-won">
          <q-input
            v-model="termsOfRetire"
            label="은퇴시기"
            stack-label
            :dense="dense"
            suffix="년 후"
            placeholder="은퇴까지 남은 기간을 입력해주세요"
            @input="termsOfRetire = formatNumber($event)"
          >
            <q-tooltip>은퇴까지 남은 기간을 입력해주세요.</q-tooltip>
          </q-input>
        </div>
        <div class="col-4">
          <q-input
            v-model="interest"
            label="수익율"
            stack-label
            :dense="dense"
            suffix="%"
            placeholder="목표 명목수익율 (숫자만 입력)"
            @input="interest = formatNumber($event)"
          >
            <q-tooltip
              >명목 수익율은 인플레이션을 고려하지 않은 일반적으로 우리 눈에
              보이는 수익율입니다.</q-tooltip
            >
          </q-input>
        </div>
        <div class="col-4">
          <q-input
            v-model="inflation"
            label="저축 증가율"
            stack-label
            :dense="dense"
            suffix="%"
            placeholder="실질 저축금액을 유지하기 위한 비율(=인플레이션)"
            @input="inflation = formatNumber($event)"
          >
            <q-tooltip
              >예상 인플레이션을 입력해주세요. 저축금액을 매년 인플레이션 만큼
              추가로 저축 한다고 가정합니다. (2~3%)
            </q-tooltip>
          </q-input>
        </div>
      </div>

      <q-separator spaced></q-separator>

      <div class="row q-col-gutter-xs">
        <div class="col-6 col-md-4">
          <q-field
            bg-color="cyan-1"
            :label="`은퇴 후 자산`"
            stack-label
            hint="자산 * 수익율^은퇴시기 + 저축금액 * (수익율 ^ 은퇴시기 - 저축증가율 ^ 은퇴시기) / (실질수익율)"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ totalAssets | format10Thousand | perThousand }} 만원
              </div>
            </template>
            <q-tooltip>
              {{ termsOfRetire || "X" }} 년 후에 모아지는 돈입니다.</q-tooltip
            >
          </q-field>
        </div>

        <div class="col-6 col-md-4">
          <q-field
            bg-color="cyan-1"
            :label="`근접 낙원 월 금액`"
            stack-label
            hint="은퇴 후 자산과 가장 근접한 낙원금액의 월 금액과 수익율"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{
                  findNearParadiseValue(totalAssets)["monthlySpend"]
                    | format10Thousand
                    | perThousand
                }}
                만원 /
                {{ findNearParadiseValue(totalAssets)["nearInterest"] }} %
              </div>
            </template>
            <q-tooltip
              >모아지는 돈과 가장 근사한 낙원금액을 만들기 위한 월금액과
              수익율을 보여줍니다.</q-tooltip
            >
          </q-field>
        </div>
      </div>
    </div>

    <div class="q-pa-md">
      <h4 class="q-my-md">당신의 낙원 금액은?</h4>
      <p>
        자산 목표 금액에서 입력한 수익율과 인플레이션을 기준으로 생성된 낙원
        테이블입니다. <br />
        월 소비금액과 수익율에 따라서 낙원 금액이 어떻게 차이 나는지 확인
        해보세요.
      </p>

      <div class="row q-col-gutter-xs">
        <div class="col-6 col-md-4">
          <q-select
            filled
            v-model="monthlySpend"
            :options="monthlySpends"
            label="월 소비액"
            stack-label
            :dense="dense"
            :options-dense="denseOpts"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label caption
                    >{{
                      scope.opt | format10Thousand | perThousand
                    }}
                    만원</q-item-label
                  >
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:selected>
              <span v-if="monthlySpend">
                {{ monthlySpend | format10Thousand | perThousand }} 만원
              </span>
            </template>
          </q-select>
        </div>

        <div class="col-6 col-md-4">
          <q-field
            label="낙원 금액"
            stack-label
            :hint="
              `${termsOfRetire || 'X'}년 후에 수익율 ${interest ||
                'X'}%로 월 소비액 (${format10ThousandUnitNumber(monthlySpend) ||
                'X'}만원)을 매달 평생동안 쓸 수 있는 (=낙원) 금액입니다.`
            "
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ paradiseAmount | format10Thousand | perThousand }} 만원
              </div>
            </template>
            <q-tooltip
              >{{ termsOfRetire }}년 후에 수익율{{ interest }}%로 월 소비액({{
                monthlySpend | format10Thousand | perThousand
              }}만원)을 평생~ 쓸 수 있는 낙원을 이룰수 있는
              금액입니다.</q-tooltip
            >
          </q-field>
        </div>

        <div class="col-6 col-md-4">
          <q-field
            label="낙원까지 남은금액"
            :bg-color="paradiseStateColor()"
            stack-label
            hint="[낙원금액 - 은퇴 후 자산]으로 낙원금액과 얼마나 차이가 나는지 나타냅니다."
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                <span v-if="paradiseAmount">
                  {{
                    (paradiseAmount - totalAssets)
                      | format10Thousand
                      | perThousand
                  }}
                  만원
                </span>
              </div>
            </template>
            <q-tooltip
              >입력하신 자산과 저축액, 수익율로 산출된 모을수 있는 돈과 낙원
              금액과의 차이 입니다. (음수는 낙원금액을 초과)</q-tooltip
            >
          </q-field>
        </div>
      </div>
    </div>

    <div class="q-pa-md">
      <q-table
        title="낙원 테이블"
        :data="paradise_data"
        :columns="paradise_columns"
        row-key="name"
        :pagination="{ rowsPerPage: 15 }"
        hide-bottom
      >
        <template v-slot:body-cell="scope">
          <q-td :class="scope.row[scope.col.field + '_color']">
            {{ scope.value }}
          </q-td>
        </template>
      </q-table>
    </div>

    <div class="q-pa-md">
      <q-card dark bordered class="bg-grey-9 my-card">
        <q-card-section>
          <div class="text-h6">어떻게 만들게 되었나?</div>
        </q-card-section>

        <q-separator dark inset />
        <q-card-section>
          할 수 있다! 알고 투자(Kangcfa) 채널의 '투자는 선택이 아니라
          생존이다!'에서 영감을 얻어 작성 하게 되었습니다. 자산적인 목표 기준을
          잡을때 도움이 될 것 같다는 생각이 듭니다.
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div
              class="col-6 col-xs-12 col-sm-12 col-md-6"
              style="position: relative;height: 0;padding-bottom: 50.25%;"
            >
              <iframe
                src="https://www.youtube.com/embed/-CKWF_PTQNg"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="position: absolute; width:100%; height:100%;"
              ></iframe>
            </div>

            <div
              class="col-6 col-xs-12 col-sm-12 col-md-6"
              style="position: relative;height: 0;padding-bottom: 50.25%;"
            >
              <iframe
                src="https://www.youtube.com/embed/XxoEzDS1Mpw"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="position: absolute; width:100%; height:100%;"
              ></iframe>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="sample" :maximized="true">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-red">
            자산은 2억, 월 100만원씩 저축(년 1,200만원), 은퇴시기는 10년후, 명목
            수익율은 10%, 월 소비액 500만원 예제 입니다.
          </div>
        </q-card-section>

        <q-img src="statics/sample.png" />

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            @click="
              sample = false;
              useDefault();
            "
            >사용하기</q-btn
          >
          <q-btn color="primary" v-close-popup>닫기</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
.input-short-won .q-field__suffix {
  width: 45px;
}
</style>

<script>
import numeral from "numeral";
import _ from "lodash";

export default {
  name: "ParadiseCalculatorMain",
  data() {
    return {
      // 만단위
      assets: "",
      // 이자
      interest: "",
      // 만단위
      yearSavingAmount: "",
      inflation: 2,
      termsOfRetire: "",
      dense: false,
      denseOpts: false,

      monthlySpends: [],
      monthlySpend: "",
      paradiseAmount: "",
      paradise_data: [],
      paradise_columns: [
        {
          name: "monthlySpend",
          required: true,
          label: "월 금액",
          align: "center",
          field: "monthlySpend",
          format: val => `월 ${this.format10ThousandUnitNumber(val)}`,
          sortable: false
        }
      ],
      // sample popup flag
      sample: false
    };
  },
  mounted() {
    numeral.nullFormat("");

    this.assets = this.formatNumber(this.assets);
    this.yearSavingAmount = this.formatNumber(this.yearSavingAmount);
    this.interest = this.formatNumber(this.interest);
    this.inflation = this.formatNumber(this.inflation);
    this.termsOfRetire = this.formatNumber(this.termsOfRetire);

    this.monthlySpends.push(...this.createMonthlySpends());

    this.createParadiseColumns();
    this.initParadaiseDatas();
  },
  watch: {
    monthlySpend() {
      this.paradiseAmount = this.calculateParadiseAmount();
    },
    assets() {
      this.initParadaiseDatas();
    },
    yearSavingAmount() {
      this.initParadaiseDatas();
    },
    inflation() {
      this.paradiseAmount = this.calculateParadiseAmount();
      this.initParadaiseDatas();
    },
    interest() {
      this.paradiseAmount = this.calculateParadiseAmount();
    },
    termsOfRetire() {
      this.paradiseAmount = this.calculateParadiseAmount();
      this.initParadaiseDatas();
    }
  },
  computed: {
    totalAssets() {
      var assets = numeral(this.assets || 0)
        .multiply(10000)
        .value();
      var yearSavingAmount = numeral(this.yearSavingAmount || 0)
        .multiply(10000)
        .value();
      var interest = numeral(this.interest || 0).value();
      var termsOfRetire = numeral(this.termsOfRetire || 0).value();

      var inflation = numeral(this.inflation || 0).value();

      return (
        numeral(assets).value() * Math.pow(1 + interest / 100, termsOfRetire) +
        (yearSavingAmount *
          (Math.pow(1 + interest / 100, termsOfRetire) -
            Math.pow(1 + inflation / 100, termsOfRetire))) /
          ((interest - inflation) / 100)
      ).toFixed(2);
    }
  },
  methods: {
    initParadaiseDatas: _.debounce(function() {
      this.paradise_data.splice(0, this.paradise_data.length);
      this.paradise_data.push(...this.calculateParadiseDatas());
    }, 300),

    inputNumberHandler(target) {
      target.value = numeral(target.value).format("0,0");
    },

    inputAmount10ThousandUnitHandler(target) {
      target.value = this.format10ThousandUnitNumber(target.value);
    },

    format10ThousandUnitNumber(value) {
      return this.formatNumber(numeral(value).value() / 10000);
    },

    formatNumber(value) {
      numeral.nullFormat("");
      return numeral(value).format("0,0");
    },

    createMonthlySpends() {
      var rangeValues = _.range(1, 15);
      var data = [];
      rangeValues.forEach(value => {
        data.push(value * 1000000);
      });

      return data;
    },

    calculateTotalAssets: _.debounce(function() {
      var assets = numeral(this.assets || 0)
        .multiply(10000)
        .value();
      var yearSavingAmount = numeral(this.yearSavingAmount || 0)
        .multiply(10000)
        .value();
      var interest = numeral(this.interest).value();
      var termsOfRetire = numeral(this.termsOfRetire).value();

      var inflation = numeral(this.inflation).value();

      return (
        numeral(assets).value() * Math.pow(1 + interest / 100, termsOfRetire) +
        (yearSavingAmount *
          (Math.pow(1 + interest / 100, termsOfRetire) -
            Math.pow(1 + inflation / 100, termsOfRetire))) /
          ((interest - inflation) / 100)
      ).toFixed(2);
    }, 100),

    calculateParadiseDatas() {
      // 1 to this.interest * 2
      // 1 to 15%
      var rangeValues = _.range(1, 15);
      var data = [];

      var nearTotalAssetGapValue = undefined;
      var nearTotalAssetGapIndex = [];

      var totalAssets = numeral(this.totalAssets).value();
      this.monthlySpends.forEach((monthlySpend, idx) => {
        var item = {};
        item.monthlySpend = monthlySpend;

        rangeValues.forEach(rangeValue => {
          var colName = `interest${rangeValue}`;
          item[colName] = this.calculateParadiseAmount(
            item.monthlySpend,
            rangeValue,
            this.inflation,
            this.termsOfRetire
          );

          if (totalAssets) {
            var gap = Math.abs(totalAssets - item[colName]);
            if (
              nearTotalAssetGapValue === undefined ||
              gap < nearTotalAssetGapValue
            ) {
              nearTotalAssetGapValue = gap;
              nearTotalAssetGapIndex = [{ index: idx, colName: colName }];
            } else if (gap === nearTotalAssetGapValue) {
              nearTotalAssetGapIndex.push({ index: idx, colName: colName });
            }
          }
        });

        data.push(item);
      });

      nearTotalAssetGapIndex.forEach(
        near => (data[near.index][near.colName + "_color"] = "bg-cyan-1")
      );
      // data[nearTotalAssetGapIndex][nearTotalAssetGapColName + "_color"] =
      //   "bg-light-blue-10";

      return data;
    },

    createParadiseColumns() {
      var rangeValues = _.range(1, 15);

      rangeValues.forEach(rangeValue => {
        var name = `interest${rangeValue}`;
        this.paradise_columns.push({
          name: name,
          field: name,
          label: `${rangeValue}%`,
          align: "center",
          format: val => this.format10ThousandUnitNumber(val),
          sortable: false
        });
      });
    },

    calculateParadiseAmount(
      amount = this.monthlySpend,
      interest = this.interest,
      inflation = this.inflation,
      terms = this.termsOfRetire
    ) {
      var _interest = interest / 100;
      var _inflation = inflation / 100;
      var paradise =
        (amount * 12 * Math.pow(1 + _inflation, terms)) / _interest;
      return paradise;
    },

    findNearParadiseValue() {
      var key;
      var found = _.find(this.paradise_data, data => {
        key = _.find(Object.keys(data), key => key.indexOf("_color") >= 0);
        return !!key;
      });

      var copy = _.cloneDeep(found || {});
      if (key) {
        var interest = key.substring("interest".length, key.indexOf("_color"));
        copy["nearInterest"] = interest;
      }

      // return found[key.substring(0, key.indexOf("_color"))]
      // return (found && found.monthlySpend) || 0;
      return copy;
    },

    paradiseStateColor() {
      if (!this.paradiseAmount) {
        return "";
      }

      var stateColors = ["red", "yellow", "green"];
      var rate = (this.paradiseAmount - this.totalAssets) / this.totalAssets;
      if (rate >= 0.5) {
        return stateColors[0];
      } else if (rate >= -0.1 && rate <= 0.1) {
        return stateColors[1];
      } else {
        return stateColors[2];
      }
    },

    useDefault() {
      this.assets = this.formatNumber(20000);
      this.yearSavingAmount = this.formatNumber(1200);
      this.interest = 10;
      this.inflation = 2;
      this.termsOfRetire = 10;
      this.monthlySpend = 5000000;
    }
  }
};
</script>
