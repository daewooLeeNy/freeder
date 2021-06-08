import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import MyLayout from '../../../src/layouts/MyLayout';
import * as All from 'quasar';
import VueRouter from 'vue-router'
import routes from '../../../src/router/routes';

const { Quasar } = All;

const components = Object.keys(All).reduce((object, key) => {
    const val = All[key];
    if (val && val.component && val.component.name != null) {
        object[key] = val;
    }

    return object;
}, {});

describe('Mount MyLayout', () => {
    const localVue = createLocalVue();
    localVue.use(Quasar, { components });
    localVue.use(VueRouter);

    const router = new VueRouter({routes});
    const wrapper = mount( MyLayout, {
        localVue, router
    });

    const vm = wrapper.vm;

    let windowOpenSpy;
    beforeEach(() => {
        windowOpenSpy = jest.spyOn(window, "open");
    });

    afterEach(() => {
        windowOpenSpy.mockRestore();
    });

    router.push('/');
    it('문의하기 버튼 확인', () => {
        expect(typeof vm.goQuestion).toBe('function');
    });

    it('문의하기 버튼 이동 확인', () => {
        windowOpenSpy.mockImplementation(() => ({
            location: {
              open: (url, target) => {
                expect(url).toEqual('https://dev-daze.tistory.com/1');
                expect(target).toEqual('_blank');
              }
            }
          }));

        vm.goQuestion();
    });
});