import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { CategoryCard } from '@shared/ui';

// F-2 수정으로 CategoryCard는 href를 받지 않고 항상 div로 렌더된다.
// 'href를 주면 링크로 렌더된다' 케이스는 공개 API에서 href가 사라져 도달 불가하므로 삭제.
// 대신 아래 '루트가 항상 div이고 링크가 아니다' 케이스로 새 계약을 단언한다.

afterEach(cleanup);

describe('CategoryCard', () => {
  it('아이콘·한영 라벨·설명·기본 goLabel을 렌더한다', () => {
    render(
      <CategoryCard
        icon={<svg data-testid="icon" />}
        name="구단"
        nameEn="Club"
        description="연혁·홈구장·팀 통계"
      />
    );
    expect(screen.getByText('구단')).toBeInTheDocument();
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('연혁·홈구장·팀 통계')).toBeInTheDocument();
    expect(screen.getByText('바로가기')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('goLabel을 주면 기본값 대신 오버라이드된 값을 렌더한다', () => {
    render(
      <CategoryCard
        icon={<svg />}
        name="구단"
        nameEn="Club"
        description="d"
        goLabel="더 보기"
      />
    );
    expect(screen.getByText('더 보기')).toBeInTheDocument();
    expect(screen.queryByText('바로가기')).toBeNull();
  });

  it('항상 div로 렌더되고 링크가 아니다', () => {
    const { container } = render(
      <CategoryCard icon={<svg />} name="구단" nameEn="Club" description="d" />
    );
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it('className이 기본 클래스 뒤에 병합돼 호출자가 우선한다', () => {
    const { container } = render(
      <CategoryCard
        icon={<svg />}
        name="구단"
        nameEn="Club"
        description="d"
        className="custom-class"
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('rounded-lg');
  });
});
