<template>
  <q-page>
    <div class="q-pa-md">
      <q-card bordered class="bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">낙원이란?</div>

          <div class="text-subtitle2">
            일하지 않고도 원하는 생활을 할 수 있는 재정 상태를 말합니다.
            <br />예를들어, 원하는 생활 수준(월 500만원)을 하기 위한 생활비가
            자본소득으로 획득이 가능 할때(월 500만원)이 들어온다면
            낙원(Paradise) 상태 입니다. (혹은 경제적자유 상태)
            <br />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <h4 class="q-my-md">당신의 자산 목표 금액은?</h4>
      <p>
        현재의 자산과 저축금액을 입력해서 은퇴시점의 자산이 어느정도 수준인지
        계산해보세요.
        <br />그리고 자산/저축/은퇴시점/수익율을 수치를 조절 하면서 재정
        목표치를 정해보세요.
      </p>

      <q-btn
        color="primary"
        label="자산:2억 저축:1200 은퇴:10년후 수익:10% 예제"
        icon-right="open_in_new"
        @click="
          sample = true;
          maximized = $q.screen.gt.md ? false : true;
        "
      ></q-btn>

      <div class="row q-col-gutter-xs">
        <div class="col-6 col-xl-2 input-short-won">
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
            label="명목 수익율"
            stack-label
            :dense="dense"
            suffix="%"
            placeholder="목표 명목수익율 (숫자만 입력)"
            @input="interest = formatNumber($event)"
          >
            <q-tooltip>
              명목 수익율은 인플레이션을 고려하지 않은 일반적으로 우리 눈에
              보이는 수익율입니다.
            </q-tooltip>
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
            <q-tooltip>
              예상 인플레이션을 입력해주세요. 저축금액을 매년 인플레이션 만큼
              추가로 저축 한다고 가정합니다. (2~3%)
            </q-tooltip>
          </q-input>
        </div>
      </div>
    </div>

    <div class="q-pa-md" v-if="totalAssets > 0">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            은퇴후 자산은
            <span class="text-h4 text-red">{{
              totalAssets | formatMultipleUnitFrom10TTo100M | perThousand(true)
            }}</span>
            입니다.
          </div>
        </q-card-section>

        <q-card-section>
          - 근접한 낙원 금액은&nbsp;
          <span class="text-subtitle1 text-indigo">
            월
            {{ foundMonthlySpend | format10Thousand | perThousand }}
            만원 / 실질 수익율
            {{ foundInterest }} % (명목 수익율:{{
              addNumber(foundInterest, inflation)
            }}%)
          </span>
          입니다.
        </q-card-section>
        <q-card-section>
          - 인플레이션을 감안한 현재가치는
          {{
            calculateParadiseMonthlySpendByCurrentValue()
              | formatMultipleUnitFrom10TTo100M
              | perThousand
          }}
          이고,
          <span class="text-indigo">
            {{ termsOfRetire }}년 후 월 금액은
            {{
              calculateParadiseMonthlySpendByFutureValue()
                | formatMultipleUnitFrom10TTo100M
                | perThousand
            }}
          </span>
          입니다.
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <h4 class="q-my-md">당신의 낙원 금액은?</h4>
      <div class="text-subtitle1">
        원하는 낙원금액(월 소비액)을 선택해보세요. 낙원을 이루기 위한 자산을
        알수 있습니다.
      </div>
      <div class="text-body text-grey">
        Tip. 낙원금액 계산을 위해선 자산 목표 금액 부분의 수익율/은퇴시기/저축
        증감율(인플레)를 입력 하셔야 합니다.
        <br />
        Tip. 월 소비금액과 수익율에 따라서 낙원 금액이 어떻게 차이 나는지 확인
        해보세요.
        <br />
        Tip. 은퇴 후 자산을 계산 하시면 낙원을 이루기 위한 자산과 은퇴 후 자산의
        차이를 알 수 있습니다.
      </div>

      <div class="row q-col-gutter-xs">
        <div class="col-12">
          <q-select
            filled
            v-model="monthlySpend"
            :options="monthlySpends"
            label="월 소비액"
            stack-label
            :dense="dense"
            :options-dense="denseOpts"
            :hint="monthlySpendValidationMessage()"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label caption>
                    {{ scope.opt | format10Thousand | perThousand }}
                    만원
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:selected>
              <span v-if="monthlySpend"
                >{{ monthlySpend | format10Thousand | perThousand }} 만원</span
              >
            </template>
          </q-select>
        </div>
      </div>
    </div>

    <div class="q-pa-md" v-if="paradiseAmount > 0">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            월
            {{ monthlySpend | formatMultipleUnitFrom10TTo100M | perThousand }}의
            낙원자산
            <span class="text-h4 text-red">
              {{
                paradiseAmount | formatMultipleUnitFrom10TTo100M | perThousand
              }}
            </span>
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            월
            {{ monthlySpend | formatMultipleUnitFrom10TTo100M | perThousand }}의
            낙원 상태를 만들기 위해서는 {{ termsOfRetire }}년 동안 자산
            {{
              paradiseAmount
                | formatMultipleUnitFrom10TTo100M
                | perThousand(true)
            }}을 모으고, 해당 자산으로 실질 수익율
            {{ addNumber(interest, -inflation) }}%을 달성 해야 합니다.
          </div>
        </q-card-section>
        <q-card-section v-if="totalAssets > 0">
          <div>
            은퇴 후 자산
            {{ totalAssets | formatMultipleUnitFrom10TTo100M | perThousand }}과
            <span :class="'text-h6 bg-' + paradiseStateColor()">
              {{
                addNumber(paradiseAmount, -totalAssets)
                  | formatMultipleUnitFrom10TTo100M
                  | perThousand
              }}
            </span>
            차이가 발생 합니다. (*음수는 초과 달성)
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <div class="text-6"></div>
      <q-table
        title="낙원 테이블"
        :data="paradise_data"
        :columns="paradise_columns"
        row-key="name"
        :pagination="{ rowsPerPage: 40 }"
      >
        <template v-slot:body-cell="scope">
          <q-td :class="scope.row[scope.col.field + '_color']">{{
            scope.value
          }}</q-td>
        </template>

        <template v-slot:bottom="scope">
          <div>
            ** 월 금액: 현재 가치, 수익율: 실질 수익율,
          </div>
          <div>
            낙원금액 계산식: (월 금액 * 12 * (1+인플레이션) ^ 은퇴시기) / 실질
            수익율
          </div>
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

    <q-dialog v-model="sample" :maximized="false">
      <q-card>
        <q-card-section>
          <div class="text-h8 text-red">
            자산은 2억, 월 100만원씩 저축(년 1,200만원), 은퇴시기는 10년후, 명목
            수익율은 10%, 월 소비액 500만원 예제 입니다.
          </div>
        </q-card-section>

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
        <!-- <q-img src="statics/sample.png" height="70%" /> -->
        <img src="statics/sample.png" />
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
      foundMonthlySpend: "",
      foundInterest: "",
      // sample popup flag
      sample: false,
      maximized: false
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
      if (this.inflation > 0 && this.interest > 0 && this.termsOfRetire > 0) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
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
      this.initParadaiseDatas();
    },
    termsOfRetire() {
      this.paradiseAmount = this.calculateParadiseAmount();
      this.initParadaiseDatas();
    }
  },
  computed: {
    totalAssets() {
      if (this.interest <= 0) {
        return "";
      }

      if (this.assets <= 0 && this.yearSavingAmount <= 0) {
        return "";
      }

      var assets = numeral(this.assets || 0)
        .multiply(10000)
        .value();
      var yearSavingAmount = numeral(this.yearSavingAmount || 0)
        .multiply(10000)
        .value();
      var interest = numeral(this.interest || 0).value();
      var termsOfRetire = numeral(this.termsOfRetire || 0).value();

      var inflation = numeral(this.inflation || 0).value();

      var calAssets =
        numeral(assets).value() * Math.pow(1 + interest / 100, termsOfRetire);
      return (
        calAssets +
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
      this.findNearParadiseValue();
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
      var rangeValues = _.range(1, 30);
      var data = [];
      var initialAmount = 1000000;
      rangeValues.forEach(() => {
        data.push(initialAmount);
        initialAmount += 500000;
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
      var rangeValues = _.range(1, 20);
      var data = [];

      var nearTotalAssetGapValue = undefined;
      var nearTotalAssetGapIndex = [];

      var totalAssets = numeral(this.totalAssets).value();
      var actualInterest = this.addNumber(this.interest, -this.inflation);
      var userMonthlySpend = numeral(this.monthlySpend).value();
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

          if (totalAssets && rangeValue === actualInterest) {
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

          if (
            userMonthlySpend &&
            userMonthlySpend === item.monthlySpend &&
            actualInterest === rangeValue
          ) {
            item[colName + "_color"] = "bg-green-1";
          }
        });

        data.push(item);
      });

      nearTotalAssetGapIndex.forEach(
        near => (data[near.index][near.colName + "_color"] = "bg-cyan-1")
      );

      return data;
    },

    createParadiseColumns() {
      var rangeValues = _.range(1, 20);

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
      interest = parseInt(this.interest || 0) - parseInt(this.inflation || 0),
      inflation = this.inflation,
      terms = this.termsOfRetire
    ) {
      if (interest <= 0 || inflation <= 0) {
        return undefined;
      }

      var _interest = interest / 100;
      var _inflation = inflation / 100;
      var paradise =
        (amount * 12 * Math.pow(1 + _inflation, terms)) / _interest;
      return paradise;
    },

    /**
     * assets 값과 수익율 물가상승율을 기준으로 기준 월급액을 확인.
     */
    calculateParadiseMonthlySpendByCurrentValue(
      assets = this.totalAssets,
      interest = this.interest,
      inflation = this.inflation,
      termsOfRetire = this.termsOfRetire
    ) {
      return (
        (assets * ((interest - inflation) / 100)) /
        Math.pow(1 + inflation / 100, termsOfRetire) /
        12
      );
    },

    calculateParadiseMonthlySpendByFutureValue(
      assets = this.totalAssets,
      interest = this.interest,
      inflation = this.inflation
    ) {
      return (assets * ((interest - inflation) / 100)) / 12;
    },

    findNearParadiseValue() {
      var actualInterest = this.addNumber(this.interest, -this.inflation);
      var key = `interest${actualInterest}`;

      var beforeNearAmountGap;
      var monthlySpend;
      _.forEach(this.paradise_data, data => {
        var gap = Math.abs(data[key] - this.totalAssets);
        if (!beforeNearAmountGap || beforeNearAmountGap > gap) {
          beforeNearAmountGap = gap;
          monthlySpend = data["monthlySpend"];
        }
      });

      this.foundMonthlySpend = monthlySpend;
      this.foundInterest = actualInterest;
    },

    paradiseStateColor() {
      if (isNaN(this.paradiseAmount) || this.paradiseAmount <= 0) {
        return "";
      }

      if (isNaN(this.totalAssets) || this.totalAssets <= 0) {
        return "";
      }

      var stateColors = ["red", "yellow", "green"];
      var rate = (this.paradiseAmount - this.totalAssets) / this.totalAssets;
      if (rate >= 0.3) {
        return stateColors[0];
      } else if (rate > -0.3 && rate < 0.3) {
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
    },

    addNumber(value1, value2) {
      return parseInt(value1 || 0) + parseInt(value2 || 0);
    },

    monthlySpendValidationMessage() {
      if (this.monthlySpend && !this.paradiseAmount) {
        var cols = [];
        if ((this.interest || 0) === 0) {
          cols.push("명목 수익율");
        }
        if ((this.inflation || 0) === 0) {
          cols.push("저축 증감율");
        }

        if ((this.termsOfRetire || 0) === 0) {
          cols.push("은퇴 시기");
        }

        return `${cols.join(",")}을(를) 입력해주세요`;
      }

      return "현재가치 기준";
    }
  }
};
</script>
