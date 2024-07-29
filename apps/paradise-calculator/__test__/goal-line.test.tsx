import GoalLine from "@/app/goal-line/page";
import { render } from "@testing-library/react";

describe("낙원 기간 목표 화면", () => {
  it("기본값이 설정된 진입 페이지", () => {
    const { container } = render(<GoalLine />);
    expect(container).toMatchSnapshot("기본값");
  });
});
