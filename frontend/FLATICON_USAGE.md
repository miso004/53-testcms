# 🎨 Flaticon 사용법 가이드

## 📦 설치 및 설정

Flaticon은 이미 프로젝트에 설정되어 있습니다. `index.html`에 CDN이 포함되어 있어 별도 설치가 필요하지 않습니다.

## 🔧 기본 사용법

### 1. FlaticonIcon 컴포넌트 사용

```jsx
import FlaticonIcon from '../components/FlaticonIcon';

// 기본 사용법
<FlaticonIcon icon="sr-home" />

// 크기 조절
<FlaticonIcon icon="sr-user" size="2rem" />

// 스타일링
<FlaticonIcon icon="sr-settings" className="text-blue-500" />
```

### 2. 아이콘 접두사

- **`sr-`**: Solid Rounded (채워진 둥근 모서리)
- **`rr-`**: Regular Rounded (테두리만 둥근 모서리)  
- **`br-`**: Brand (브랜드 아이콘)

## 🎯 자주 사용하는 아이콘들

### 기본 UI 아이콘
- `sr-home` - 홈
- `sr-user` - 사용자
- `sr-settings` - 설정
- `sr-search` - 검색
- `sr-bell` - 알림
- `sr-heart` - 좋아요
- `sr-star` - 별표
- `sr-download` - 다운로드

### 네비게이션 아이콘
- `sr-home` - 홈
- `sr-megaphone` - 공지사항
- `sr-comments` - 댓글/게시판
- `sr-question-circle` - 질문
- `sr-cog` - 관리

### 액션 아이콘
- `sr-plus` - 추가
- `sr-edit` - 편집
- `sr-trash` - 삭제
- `sr-eye` - 보기
- `sr-lock` - 잠금
- `sr-unlock` - 잠금 해제

## 🎨 스타일링 예시

```jsx
// 색상 변경
<FlaticonIcon icon="sr-heart" className="text-red-500" />

// 크기와 색상
<FlaticonIcon icon="sr-star" size="1.5rem" className="text-yellow-500" />

// 마진과 패딩
<FlaticonIcon icon="sr-user" className="mr-2 text-blue-600" />

// 호버 효과
<FlaticonIcon 
  icon="sr-settings" 
  className="text-gray-400 hover:text-blue-500 transition-colors" 
/>
```

## 📱 반응형 아이콘

```jsx
// 화면 크기에 따른 아이콘 크기 조절
<FlaticonIcon 
  icon="sr-home" 
  className="text-lg md:text-xl lg:text-2xl" 
/>
```

## 🔗 FontAwesome과 함께 사용

Flaticon과 FontAwesome을 함께 사용할 수 있습니다:

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import FlaticonIcon from '../components/FlaticonIcon';

// FontAwesome 아이콘
<FontAwesomeIcon icon={faHome} />

// Flaticon 아이콘
<FlaticonIcon icon="sr-home" />
```

## 💡 팁

1. **일관성**: 프로젝트 전체에서 동일한 스타일의 아이콘 사용
2. **접근성**: `title` 속성으로 아이콘 의미 설명
3. **성능**: 필요한 아이콘만 import하여 번들 크기 최적화
4. **테마**: 다크/라이트 모드에 맞는 아이콘 색상 사용

## 📚 더 많은 아이콘

Flaticon 공식 사이트에서 더 많은 아이콘을 찾을 수 있습니다:
- [Flaticon.com](https://www.flaticon.com/)
- [Uicons](https://www.flaticon.com/uicons) - 최신 아이콘 세트

