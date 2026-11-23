# 큰글씨 청첩장

예식 일시, 약도, 교통 안내, 공개 연락처와 계좌, 글자 크기 선택, 링크 복사를 제공하는 독립 정적 청첩장입니다.

## 실행

Node.js 22를 사용합니다.

```sh
npm ci
npm run dev
```

`npm test`로 공개 설정 처리와 공유 링크를 확인하고, `npm run build`로 `dist`를 생성합니다. `npm run preview`로 생성한 빌드를 확인할 수 있습니다.

## 예식 정보 수정

[src/content/wedding.json](src/content/wedding.json)을 수정하면 본문과 공유 미리보기의 제목·설명에 같은 값이 반영됩니다. 연락처와 계좌는 공개할 항목에만 `confirmed: true`를 지정합니다. 이 파일은 공개 저장소에 포함될 수 있으므로 공개할 정보만 넣어 주세요.

원본에서 관리자 설정을 다시 가져올 때는 이 프로젝트에서 다음 명령을 실행하고 변경된 `wedding.json`을 확인한 후 커밋합니다. 별도 `DATA_DIR`을 사용했다면 그 디렉터리의 `state.json`을 지정합니다.

```sh
npm run content:import -- ../wedding-invitation/server/data/state.json
```

청첩장은 마지막으로 반영한 설정을 사용합니다. 예식장이 바뀌면 웨딩시티 전용 약도도 함께 바꿔 주세요.

## GitHub Pages 배포

이 저장소는 `main` 루트에서 [wedding.parkjh.co.kr](https://wedding.parkjh.co.kr/)을 게시합니다. 소스는 `codex/standard-source`에 있습니다.

1. 소스를 수정하고 테스트한 후 `npm run build`를 실행합니다.
2. `main`을 별도 작업 폴더에 체크아웃하고 `dist`의 파일을 그 작업 폴더의 루트에 복사합니다. 기존 `CNAME`과 `.nojekyll`은 유지하고, 새 빌드에서 사용하지 않는 이전 해시 자산은 정리합니다.
3. 배포 파일을 `main`에 커밋하고 푸시한 후 **Actions → pages build and deployment**의 결과를 확인합니다.

소스 브랜치의 Pages 워크플로는 저장소의 게시 방식을 GitHub Actions로 전환할 때 사용할 수 있습니다.
