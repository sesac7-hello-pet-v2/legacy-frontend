# Hello Pet Frontend

기존 Next.js 프론트엔드 프로젝트에 **로컬 VM Kubernetes 환경 배포를 위해 Skaffold를 추가**한 상태입니다.
개발 환경 매니페스트와 skaffold 설정은 `infra/profile/dev/` 폴더에 있습니다.

---

## 🚀 실행 방법

### 1. 로컬에서 띄우기

```bash
cd infra/profile/dev
skaffold dev
```

소스 코드 변경 시 자동으로 빌드 및 Kubernetes에 반영됩니다.

---

### 2. 호스트 설정

Ingress Controller가 MetalLB를 통해 `10.10.10.200` IP를 받아 `hello.pet` 도메인으로 접근할 수 있습니다.
호스트 PC의 `/etc/hosts` (Linux/Mac) 또는 `C:\Windows\System32\drivers\etc\hosts` (Windows)에 다음을 추가하세요:

```
10.10.10.200   hello.pet
```

브라우저에서 `http://hello.pet` 으로 접속하면 서비스가 열립니다.

---

## 📂 구조

```
app/                  # Next.js 프론트엔드
Dockerfile            # 이미지 빌드용
infra/profile/dev/    # dev 환경용 매니페스트 + skaffold.yaml
```
