import GoalInterest from "@/app/goal-interest/page";
import { render } from "@testing-library/react";

describe("목표 수익율 화면", () => {
  it("기본값이 설정된 진입 페이지", () => {
    const { container } = render(<GoalInterest />);
    expect(container).toMatchSnapshot("기본값");
  });
});
