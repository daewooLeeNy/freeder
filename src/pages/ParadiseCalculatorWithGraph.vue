<template>
  <q-page>
    <div class="q-pa-md banner-container">
      <q-carousel
        swipeable
        animated
        v-model="slide"
        infinite
        :style="slideStyle"
      >
          <q-carousel-slide :name="1" :draggable="false" class="fit">
            <div class="banner">
              <img src="~assets/img_banner/img_banner2.png" @load="bannerLoaded"/>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="2" :draggable="false"  class="fit">
            <div class="banner">
              <img src="~assets/img_banner/img_banner1.png"/>
            </div>
          </q-carousel-slide>

          <template v-slot:control>
            <q-carousel-control
              position="top-right"
              :offset="[18, 18]"
              style="margin:0;padding:5px"
            >
              <div class="Rectangle"> <span class="pagination_current"> {{slide}} </span> <span class="pagination_total">/  2 </span> </div>

            </q-carousel-control>
          </template>
      </q-carousel>
    </div>

    <div class="q-pa-md">
      <h4 class="q-my-md">당신의 자산 목표 금액은?</h4>
      <p>
        현재의 자산과 저축금액을 입력해서 은퇴시점의 자산이 어느정도 수준인지
        계산해보세요.
        <br />그리고 자산/저축/은퇴시점/수익율을 수치를 조절 하면서 재정
        목표치를 정해보세요.
      </p>

      <div class="q-gutter-sm">
        <q-btn
          label="예: 현재 자산2억, 연1200만원 저축, 연10% 수익율 그리고 10년후 은퇴"
          class="tag"
          @click="showExample"
        ></q-btn>

        <q-btn
          label="#자산1억 10% 10년"
          class="tag"
          @click="useFavorite1"
        ></q-btn>

        <q-btn
          label="#자산1억 10년 10억 목표"
          class="tag"
          @click="useFavorite2"
        ></q-btn>
      </div>

      <div class="q-gutter-sm" style="margin-top:5px;">
        <q-btn
          color="primary"
          label="낙원 설문 참여하기 😘"
          icon-right="open_in_new"
          @click="moveSurvey()"
        ></q-btn>
      </div>

      <div class="row q-col-gutter-xs">
        <div class="col-6 col-xl-2 input-short-won">
          <q-input
            :value="asset"
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
            :value="periodOfRetire"
            label="은퇴시기"
            stack-label
            :dense="dense"
            suffix="년 후"
            placeholder="은퇴까지 남은 기간을 입력해주세요"
            @input="changeperiodOfRetire"
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
                  totalAsset
                    | formatMultipleUnitFrom10TTo100M
                    | perThousand(true)
                }}
              </div>
            </template>
            <q-tooltip
              >{{ periodOfRetire || "X" }} 년 후에 모아지는 돈입니다.</q-tooltip
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
                <span v-if="totalAsset > 0 && foundMonthlySpend > 0">
                  {{ foundMonthlySpend | format10Thousand | perThousandFloor }}
                  만원 /
                  {{ (foundInterest * 100).toFixed(0)}} % (명목:{{interest}}%)
                </span>
              </div>
            </template>
            <q-tooltip>
              은퇴 자산으로 벌어들이는 월 수입과 실질 수익율을 보여줍니다.
            </q-tooltip>
          </q-field>
        </div>
      </div>
    </div>

    <div class="q-pa-md">
      <asset-bar-chart
        v-if="totalAsset > 0"
        :asset="numeralAsset"
        :yearSavingAmount="numeralYearSavingAmount"
        :interest="numeralInterest"
        :periodOfRetire="numeralPeriodOfRetire"
        :inflation="numeralInflation"
      ></asset-bar-chart>
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
                  {{ periodOfRetire }}년후
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
              {{ periodOfRetire }}년 후에 수익율{{ interest }}%로 월 소비액({{
                monthlySpend | format10Thousand | perThousand
              }}만원. ({{ periodOfRetire }}년 인플레 포함 =
              {{ monthlySpend * Math.pow(1 + interest, periodOfRetire) }}만원)을
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
                <span v-if="paradiseAmount > 0 && totalAsset > 0">
                  {{
                    addNumber(paradiseAmount, -totalAsset)
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
            @click="useExample1"
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
import numeral from 'numeral';
import _ from 'lodash';
import { calculateTotalAsset } from '../components/Calculator';
import AssetBarChart from './AssetBarChart.vue';

export default {
  name: 'ParadiseCalculatorMain',
  components: { AssetBarChart },
  data() {
    return {
      // 만단위
      asset: '',
      // 이자
      interest: '',
      // 만단위
      yearSavingAmount: '',
      inflation: 3,
      periodOfRetire: '',
      dense: false,
      denseOpts: false,

      monthlySpends: [],
      monthlySpend: '',
      totalAsset: '',
      paradiseAmount: '',
      paradise_data: [],
      paradise_columns: [
        {
          name: 'monthlySpend',
          required: true,
          label: '월 금액',
          align: 'center',
          field: 'monthlySpend',
          format: val => `월 ${this.format10ThousandUnitNumber(val)}`,
          sortable: false
        }
      ],
      foundMonthlySpend: '',
      foundInterest: '',
      // sample popup flag
      sample: false,
      maximized: false,
      slide: 1,
      slideStyle: 'height:initial',
    };
  },
  mounted() {
    numeral.nullFormat('');

    window.gtag('event', 'page_view', {
      page_title: this.$route.name,
      page_location: this.$route.name,
      page_path: this.$route.path
    });

    this.monthlySpends.push(...this.createMonthlySpends());

  },
  watch: {
    monthlySpend() {
      if (this.numeralInflation > 0 && this.numeralInterest > 0 && this.numeralPeriodOfRetire > 0) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
    },
    asset() {
      if (this.isReadyCalculation) {
        this.initParadaiseDatas();
      }
    },
  yearSavingAmount() {
      if (this.isReadyCalculation) {
        this.initParadaiseDatas();
      }
    },
    inflation() {
      if (this.isReadyCalculation) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
    },
    interest(newInterest) {
      if (
        this._isReadyCalculation({
          asset: this.asset,
          yearSavingAmount: this.yearSavingAmount,
          interest: newInterest,
          periodOfRetire: this.periodOfRetire
        })
      ) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
    },
    periodOfRetire(newperiodOfRetire) {
      if (
        this._isReadyCalculation({
          asset: this.asset,
          yearSavingAmount: this.yearSavingAmount,
          interest: this.interest,
          periodOfRetire: newperiodOfRetire
        })
      ) {
        this.paradiseAmount = this.calculateParadiseAmount();
        this.initParadaiseDatas();
      }
    }
  },
  computed: {
    isReadyCalculation() {
      return this._isReadyCalculation({
        asset: this.asset,
        yearSavingAmount: this.yearSavingAmount,
        interest: this.interest,
        periodOfRetire: this.periodOfRetire
      });
    },
    numeralAsset() {
      return numeral(this.asset || 0).multiply(10000).value();
    },
    numeralYearSavingAmount() {
      return numeral(this.yearSavingAmount || 0).multiply(10000).value();
    },
    numeralPeriodOfRetire() {
      return numeral(this.periodOfRetire || 0).value();
    },
    numeralInterest() {
      return numeral(this.interest || 0).divide(100).value();
    },
    numeralInflation() {
      return numeral(this.inflation || 0).divide(100).value();
    },
  },
  methods: {
    _isReadyCalculation({ asset, yearSavingAmount, interest, periodOfRetire }) {
      return (
        (numeral(asset).value() > 0 ||
          numeral(yearSavingAmount).value() > 0) &&
        numeral(interest).value() > 0 &&
        numeral(periodOfRetire).value() > 0
      );
    },
    initParadaiseDatas: _.debounce(function() {
      const inputs = {
        asset: this.numeralAsset,
        yearSavingAmount: this.numeralYearSavingAmount,
        periodOfRetire: this.numeralPeriodOfRetire,
        interest: this.numeralInterest,
        inflation: this.numeralInflation
      };
      const {totalAsset} = calculateTotalAsset(inputs);
      this.totalAsset = totalAsset;

      this.findNearParadiseValue();
      this.sendGATotalAsset(totalAsset);
      this.sendGAInputs(inputs);
    }, 0),

    changeAssets(value) {
      this.asset = this.formatNumber(value);

      this.sendGAInputAssets(value);
    },

    changeYearSavingAmount(value) {
      // this.yearSavingAmount = this.formatNumber(value)
      this.yearSavingAmount = numeral(value).format('0,0');
      // this.sendGAYearSavingAmount(value);
    },

    changeInterest(value) {
      this.interest = this.formatNumber(value);
      this.sendGAInterest(value);
    },

    changeInflation(value) {
      this.inflation = this.formatNumber(value);
      this.sendGAInflation(value);
    },

    changeperiodOfRetire(value) {
      this.periodOfRetire = this.formatNumber(value);
      this.sendGAperiodOfRetire(value);
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

    sendGAperiodOfRetire: _.debounce(function(value) {
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

    sendGATotalAsset: _.debounce(function(value) {
      let amountByUnit = this.amountClassfication(value, 100000000);
      window.gtag('event', 'calculate', {
        event_category: '은퇴 총자산',
        event_label: amountByUnit ? `${amountByUnit} 억` : amountByUnit
      });
    }, 2000),

    sendGAInputs: _.debounce(function(inputs) {
      let values = [];
      for(let key in inputs) {
        values.push(`${key}=${inputs[key]}`);
      }

      window.gtag('event', 'input', {
        event_category: '계산입력값',
        event_label: values.join('&')
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
      if (isNaN(value)) {
        return value;
      }

      let amountByUnit = (value / unit).toFixed(1);
      if (amountByUnit > 10 && amountByUnit < 100) {
        amountByUnit = Math.floor(amountByUnit / 5) * 5;
      } else if (amountByUnit > 100) {
        amountByUnit = Math.floor(amountByUnit / 100) * 100;
      }

      return amountByUnit;
    },
    inputNumberHandler(target) {
      target.value = numeral(target.value).format('0,0');
    },

    inputAmount10ThousandUnitHandler(target) {
      target.value = this.format10ThousandUnitNumber(target.value);
    },

    format10ThousandUnitNumber(value) {
      return this.formatNumber(numeral(value).value() / 10000);
    },

    formatNumber(value) {
      numeral.nullFormat('');
      return numeral(value).format('0,0');
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



    calculateParadiseAmount(
      amount = this.monthlySpend,
      interest = this.numeralInterest - this.numeralInflation,
      inflation = this.numeralInflation,
      terms = this.periodOfRetire
    ) {
      if (interest <= 0 || inflation <= 0) {
        return undefined;
      }

      var paradise =
        (amount * 12 * Math.pow(1 + inflation, terms)) / interest;
      return paradise;
    },

    calculateParadiseMonthlyIncome(
      totalAsset,
      interest = this.numeralInterest - this.numeralInflation,
      inflation = this.numeralInflation,
      terms = this.periodOfRetire
    ) {
      if (interest <= 0) {
        return undefined;
      }

      var paradise =
        ((totalAsset / Math.pow(1 + inflation, terms)) * interest) / 12;
      return paradise;
    },

    findNearParadiseValue() {
      const actualInterest = this.numeralInterest - this.numeralInflation;
      this.foundMonthlySpend = Math.floor(
        this.calculateParadiseMonthlyIncome(this.totalAsset)
      );
      this.foundInterest = actualInterest;

      this.sendGACalculatedMonthlySpend(this.foundMonthlySpend);
    },

    paradiseStateColor() {
      if (isNaN(this.paradiseAmount) || this.paradiseAmount <= 0) {
        return '';
      }

      if (isNaN(this.totalAsset) || this.totalAsset <= 0) {
        return '';
      }

      var stateColors = ['red', 'yellow', 'green'];
      var rate = (this.paradiseAmount - this.totalAsset) / this.totalAsset;
      if (rate >= 0.5) {
        return stateColors[0];
      } else if (rate > -0.5 && rate < 0.5) {
        return stateColors[1];
      } else {
        return stateColors[2];
      }
    },

    useDefault() {
      this.asset = this.formatNumber(20000);
      this.yearSavingAmount = this.formatNumber(1200);
      this.interest = 10;
      this.inflation = 2;
      this.periodOfRetire = 10;
      this.monthlySpend = 5000000;
    },

    favoriteSet1() {
      // 자산1억, 10%, 10년
      this.asset = this.formatNumber(10000);
      this.yearSavingAmount = this.formatNumber(0);
      this.interest = 10;
      this.inflation = 3;
      this.periodOfRetire = 10;
      this.monthlySpend = 0;
    },

    favoriteSet2() {
      // 자산1억, 10년, 10억
      this.asset = this.formatNumber(10000);
      this.yearSavingAmount = this.formatNumber(0);
      this.interest = 26;
      this.inflation = 3;
      this.periodOfRetire = 10;
      this.monthlySpend = 0;
    },

    addNumber(value1, value2) {
      return parseInt(value1 || 0) + parseInt(value2 || 0);
    },

    showExample() {
      this.useExample1();
    },

    useExample1() {
      window.gtag('event', 'click', {
        event_category: 'tag',
        event_label: 'use1'
      });

      this.sample = false;
      this.useDefault();
    },

    useFavorite1() {
      this.favoriteSet1();
      this.sendGASetTag('favorite1')
    },

    useFavorite2() {
      this.favoriteSet2();
      this.sendGASetTag('favorite2')
    },

    sendGASetTag(tabName) {
      const {asset, yearSavingAmount, interest, inflation, periodOfRetire, monthlySpend} = this;
      window.gtag('event', 'click', {
        event_category: 'tag',
        event_label: JSON.stringify({tag: tabName, asset, yearSavingAmount, interest, inflation, periodOfRetire, monthlySpend})
      });
    },
    bannerLoaded($el) {
      this.slideStyle = `height:${$el.currentTarget.height}px`;
    }

  }
};
</script>


<style>
.scroll {
  overflow:hidden
}
</style>


<style scoped>

.tag {
  margin-right: 5px;
}

.q-carousel__slide { 
  padding: initial;
}

.banner-container {
  padding-bottom: 0px;
}

.banner > img {
  width: 100%;
  pointer-events: none;
  user-drag: none; 
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;

}


.Rectangle {
  width: 45px;
  padding: 0 0 0 11px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.3);
}

.pagination_total  {
  width: 13px;
  height: 13px;
  margin: 0;
  opacity: 0.5;
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
}

.pagination_current {
  opacity: 1;
  width: 6px;
  height: 13px;
  margin: 0 0 0 0;
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #fff;
}


@media (min-width: 620px) {
  .banner {
    max-width:620px;
  }
}
</style>
