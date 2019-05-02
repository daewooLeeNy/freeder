<template>
  <q-page>
    <div class="q-pa-md">
      <h4 class="q-mt-md">당신의 목표 금액은?</h4>

      <div class="row q-col-gutter-xs">
        <div class="col-4 col-md-4 col-lg-2  col-xl-2  input-short-won">
          <q-input
            v-model="assets"
            label="자산"
            stack-label
            :dense="dense"
            suffix="만원"
            placeholder="e.g. 10,000"
            @input="assets = formatNumber($event)"
          >
            <q-tooltip>현재 자산을 만원 단위로 입력해주세요.</q-tooltip>
          </q-input>
        </div>

        <div class="col-4 col-md-4 col-lg-2 col-xl-2 input-short-won">
          <q-input
            v-model="yearSavingAmount"
            type="text"
            label="저축금액(연)"
            stack-label
            :dense="dense"
            suffix="만원"
            placeholder="e.g. 1,200"
            @input="yearSavingAmount = formatNumber($event)"
          >
            <q-tooltip
              >한해 동안 저축 가능한 금액을 만원 단위로 입력해주세요.</q-tooltip
            >
          </q-input>
        </div>

        <div class="col-4 col-md-4 col-lg-2 col-xl-1">
          <q-input
            v-model="termsOfRetire"
            label="은퇴시점"
            stack-label
            :dense="dense"
            suffix="년"
            placeholder="e.g. 20"
            @input="termsOfRetire = formatNumber($event)"
          >
            <q-tooltip>은퇴하고 싶은 시기를 적어주세요.</q-tooltip>
          </q-input>
        </div>
        <div class="col-4 col-md-4  col-lg-2 col-xl-1">
          <q-input
            v-model="interest"
            label="수익율"
            stack-label
            :dense="dense"
            suffix="%"
            placeholder="e.g. 8"
            @input="interest = formatNumber($event)"
          >
            <q-tooltip>명목 수익율을 입력해주세요.</q-tooltip>
          </q-input>
        </div>
        <div class="col-4 col-md-4  col-lg-2 col-xl-1">
          <q-input
            v-model="inflation"
            label="인플레이션"
            stack-label
            :dense="dense"
            suffix="%"
            placeholder="e.g. 2"
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
            :label="`${termsOfRetire}년 후 모아지는 돈`"
            stack-label
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ totalAssets | format10Thousand | perThousand }} 만원
              </div>
            </template>
            <q-tooltip>
              {{ termsOfRetire }} 년 후에 모아지는 돈입니다.</q-tooltip
            >
          </q-field>
        </div>

        <div class="col-6 col-md-4">
          <q-field bg-color="cyan-1" :label="`근접 낙원 월 금액`" stack-label>
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
      <h4 class="q-mt-md">당신의 낙원 금액은?</h4>

      <!-- <div class="q-gutter-md row"> -->
      <!-- <div style="q-gutter-"> -->
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
          <q-field label="낙원 금액" stack-label>
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
            <!-- {{ scope.row[scope.col.field] }} -->
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
      inflation: "",
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
      ]
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
    }
  }
};
</script>
