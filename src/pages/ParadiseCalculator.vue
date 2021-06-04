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
            :value="assets"
            label="보유 자산"
            stack-label
            :dense="dense"
            suffix="만원"
            placeholder="은퇴기간 동안 자본소득을 발생 시키는 자산 금액입니다"
            @input="changeAssets"
          >
            <q-tooltip>현재 자산을 만원 단위로 입력해주세요.</q-tooltip>
          </q-input>
        </div>

        <div class="col-6 col-xl-2 input-short-won">
          <q-input
            :value="yearSavingAmount"
            type="text"
            label="저축금액(연)"
            stack-label
            :dense="dense"
            suffix="만원"
            placeholder="한해 동안 저축 가능한 금액입니다"
            @input="changeYearSavingAmount"
          >
            <q-tooltip
              >한해 동안 저축 가능한 금액을 만원 단위로 입력해주세요.</q-tooltip
            >
          </q-input>
        </div>

        <div class="col-4 input-short-won">
          <q-input
            :value="termsOfRetire"
            label="은퇴시기"
            stack-label
            :dense="dense"
            suffix="년 후"
            placeholder="은퇴까지 남은 기간을 입력해주세요"
            @input="changeTermsOfRetire"
          >
            <q-tooltip>은퇴까지 남은 기간을 입력해주세요.</q-tooltip>
          </q-input>
        </div>
        <div class="col-4">
          <q-input
            :value="interest"
            label="명목 수익율"
            stack-label
            :dense="dense"
            suffix="%"
            placeholder="목표 명목수익율 (숫자만 입력)"
            @input="changeInterest"
          >
            <q-tooltip>
              명목 수익율은 인플레이션을 고려하지 않은 일반적으로 우리 눈에
              보이는 수익율입니다.
            </q-tooltip>
          </q-input>
        </div>
        <div class="col-4">
          <q-input
            :value="inflation"
            label="저축 증가율"
            stack-label
            :dense="dense"
            suffix="%"
            placeholder="실질 저축금액을 유지하기 위한 비율(=인플레이션)"
            @input="changeInflation"
          >
            <q-tooltip>
              예상 인플레이션을 입력해주세요. 저축금액을 매년 인플레이션 만큼
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
                {{
                  totalAssets
                    | formatMultipleUnitFrom10TTo100M
                    | perThousand(true)
                }}
              </div>
            </template>
            <q-tooltip
              >{{ termsOfRetire || "X" }} 년 후에 모아지는 돈입니다.</q-tooltip
            >
          </q-field>
        </div>

        <div class="col-6 col-md-4">
          <q-field
            bg-color="cyan-1"
            :label="`은퇴 후 월 수입`"
            stack-label
            hint="은퇴 후 자산과 실질 수익율로 벌어들이는 월 수입"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                <span v-if="totalAssets > 0">
                  {{ foundMonthlySpend | format10Thousand | perThousandFloor }}
                  만원 /
                  {{ foundInterest }} % (명목:{{
                    addNumber(foundInterest, inflation)
                  }}%)
                </span>
              </div>
            </template>
            <q-tooltip>
              모아지는 돈과 가장 근사한 낙원금액을 만들기 위한 월금액과 실질
              실질 수익율을 보여줍니다.
            </q-tooltip>
          </q-field>
        </div>
      </div>
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
        <div class="col-6 col-md-4">
          <q-select
            filled
            :value="monthlySpend"
            :options="monthlySpends"
            label="월 소비액"
            stack-label
            :dense="dense"
            :options-dense="denseOpts"
            @input="changeMonthlySpend"
            hint="현재가치 기준"
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
              <span v-else></span>
            </template>
          </q-select>
        </div>

        <div class="col-6 col-md-4">
          <q-field
            label="낙원 금액"
            stack-label
            hint="연복리 실질 수익율, 현재 가치의 월 금액"
            bg-color="green-1"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                <span v-if="paradiseAmount > 0">
                  {{ termsOfRetire }}년후
                  {{
                    paradiseAmount
                      | formatMultipleUnitFrom10TTo100M
                      | perThousand(true)
                  }}/연{{ addNumber(interest, -inflation) }}%로 월{{
                    monthlySpend | format10Thousand | perThousand
                  }}만원 Paradise!
                </span>
              </div>
            </template>
            <q-tooltip>
              {{ termsOfRetire }}년 후에 수익율{{ interest }}%로 월 소비액({{
                monthlySpend | format10Thousand | perThousand
              }}만원. ({{ termsOfRetire }}년 인플레 포함 =
              {{ monthlySpend * Math.pow(1 + interest, termsOfRetire) }}만원)을
              평생~ 쓸 수 있는 낙원을 이룰수 있는 금액입니다.
            </q-tooltip>
          </q-field>
        </div>

        <div class="col-6 col-md-4">
          <q-field
            label="낙원까지 남은금액"
            :bg-color="paradiseStateColor()"
            stack-label
            hint="[낙원금액 - 은퇴 후 자산]으로 낙원금액과의 차이"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                <span v-if="paradiseAmount > 0 && totalAssets > 0">
                  {{
                    addNumber(paradiseAmount, -totalAssets)
                      | formatMultipleUnitFrom10TTo100M
                      | perThousand
                  }}
                </span>
              </div>
            </template>
            <q-tooltip>
              입력하신 자산과 저축액, 수익율로 산출된 모을수 있는 돈과 낙원
              금액과의 차이 입니다. (음수는 낙원금액을 초과)
            </q-tooltip>
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
        :pagination="{ rowsPerPage: 40 }"
      >
        <template v-slot:body-cell="scope">
          <q-td :class="scope.row[scope.col.field + '_color']">{{
            scope.value
          }}</q-td>
        </template>

        <template v-slot:bottom>
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
      if(this.isReadyCalculation) {
        this.initParadaiseDatas();
      }
    },
    yearSavingAmount() {
      if(this.isReadyCalculation) {
        this.initParadaiseDatas();
      }
    },
    inflation() {
      if(this.isReadyCalculation) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
    },
    interest() {
      if(this.isReadyCalculation) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
    },
    termsOfRetire() {
      if(this.isReadyCalculation) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
    }
  },
  computed: {
    isReadyCalculation() {
      return (this.assets > 0 || this.yearSavingAmount) && this.inflation > 0 && this.interest > 0 && this.termsOfRetire > 0;
    },
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

      const totalAssets = (
        calAssets +
        (yearSavingAmount *
          (Math.pow(1 + interest / 100, termsOfRetire) -
            Math.pow(1 + inflation / 100, termsOfRetire))) /
          ((interest - inflation) / 100)
      ).toFixed(2);

      this.sendGATotalAssets(totalAssets);
      return totalAssets;
    }
  },
  methods: {
    initParadaiseDatas: _.debounce(function() {
      this.paradise_data.splice(0, this.paradise_data.length);
      this.paradise_data.push(...this.calculateParadiseDatas());
      this.findNearParadiseValue();
    }, 0),

    changeAssets(value) {
      this.assets = this.formatNumber(value);

      this.sendGAInputAssets(value);
    },

    changeYearSavingAmount(value) {
      this.yearSavingAmount = this.formatNumber(value)
      this.sendGAYearSavingAmount(value);
    },

    changeInterest(value) {
      this.interest = this.formatNumber(value)
      this.sendGAInterest(value);
    },

    changeInflation(value) {
      this.inflation = this.formatNumber(value)
      this.sendGAInflation(value);
    },

    changeTermsOfRetire(value) {
      this.termsOfRetire = this.formatNumber(value)
      this.sendGATermsOfRetire(value);
    },

    changeMonthlySpend(value) {
      this.monthlySpend = value;
      this.sendGAMonthlySpend(value);
    },
    
    sendGAInputAssets: _.debounce(function(value) {
      window.gtag('event', 'input', {
        event_category: '자산',
        event_label: value ? value.replace(/,/g, '') : value
      });
    }, 5000),

    sendGAYearSavingAmount: _.debounce(function(value) {
      window.gtag('event', 'input', {
        event_category: '연저축',
        event_label: value
      });
    }, 5000),

    sendGAInterest: _.debounce(function(value) {
      window.gtag('event', 'input', {
        event_category: '수익율',
        event_label: value
      });
    }, 5000),

    sendGAInflation: _.debounce(function(value) {
      window.gtag('event', 'input', {
        event_category: '인플레이션',
        event_label: value
      });
    }, 5000),

    sendGATermsOfRetire: _.debounce(function(value) {
      window.gtag('event', 'input', {
        event_category: '기간',
        event_label: value
      });
    }, 5000),

    sendGAMonthlySpend: _.debounce(function(value) {
      window.gtag('event', 'select', {
        event_category: '월소비금액',
        event_label: value
      });
    }, 2000),

    sendGATotalAssets: _.debounce(function(value) {
      let amountByUnit = this.amountClassfication(value, 100000000);
      window.gtag('event', 'calculate', {
        event_category: '은퇴 총자산',
        event_label: amountByUnit ? `${amountByUnit} 억` : amountByUnit
      });
    }, 2000),

    sendGACalculatedMonthlySpend: _.debounce(function(value) {
      let amountByUnit = this.amountClassfication(value, 1000000);

      window.gtag('event', 'calculate', {
        event_category: '은퇴 월소비',
        event_label: amountByUnit ? `${amountByUnit} 백만` : amountByUnit
      });
    }, 2000),

    amountClassfication(value, unit) {
      if(isNaN(value)) {
        return value;
      } 

      let amountByUnit = (value / unit).toFixed(1);
      if(amountByUnit > 10 && amountByUnit < 100) {
        amountByUnit = Math.floor(amountByUnit / 5) * 5;
      } else if(amountByUnit > 100) {
        amountByUnit = Math.floor(amountByUnit / 100) * 100;
      }

      return amountByUnit;
    },
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

       const totalAssets = (
        numeral(assets).value() * Math.pow(1 + interest / 100, termsOfRetire) +
        (yearSavingAmount *
          (Math.pow(1 + interest / 100, termsOfRetire) -
            Math.pow(1 + inflation / 100, termsOfRetire))) /
          ((interest - inflation) / 100)
      ).toFixed(2);

      return totalAssets;
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
      var paradise = (amount * 12 * Math.pow(1 + _inflation, terms)) / _interest;
      return paradise;
    },

    calculateParadiseMonthlyIncome(
      totalAsset,
      interest = parseInt(this.interest || 0) - parseInt(this.inflation || 0),
      inflation = this.inflation,
      terms = this.termsOfRetire
    ) {
      if (interest <= 0 || inflation <= 0) {
        return undefined;
      }

      var _interest = interest / 100;
      var _inflation = inflation / 100;
      var paradise = (totalAsset / Math.pow(1 + _inflation, terms)) * _interest / 12;
      return paradise;
    },

    findNearParadiseValue() {
      const actualInterest = this.addNumber(this.interest, -this.inflation);
      this.foundMonthlySpend = Math.floor(this.calculateParadiseMonthlyIncome(this.totalAssets));
      this.foundInterest = actualInterest;

      this.sendGACalculatedMonthlySpend(this.foundMonthlySpend);
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
      if (rate >= 0.5) {
        return stateColors[0];
      } else if (rate > -0.5 && rate < 0.5) {
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
    }
  }
};
</script>
