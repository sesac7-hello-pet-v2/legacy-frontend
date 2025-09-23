# Hello Pet Frontend

기존 Next.js 프론트엔드 프로젝트에 **로컬 VM Kubernetes 환경 배포를 위해 Skaffold를 추가**한 상태입니다.
개발 환경 매니페스트와 skaffold 설정은 `infra/profile/dev/` 폴더에 있습니다.

모든 환경설정을 끝내고 `hello.pet`으로 접속하시면 됩니다.

---
## 🏷️ 로컬 레지스트리 (10.10.10.1:5000)

이미지는 로컬 레지스트리 10.10.10.1:5000/hello-pet-frontend 로 푸시/풀 합니다.
(Skaffold는 build.local.push: true 설정)

```bash
# 포트 5000 레지스트리 (registry2 컨테이너 예시)
docker run -d --restart=always --name registry2 -p 5000:5000 registry:2
# 확인
curl http://10.10.10.1:5000/v2/_catalog
```
---

## 🔧 설치 (kubectl, Skaffold)

### kubectl 설치

* **macOS**

  ```bash
  brew install kubectl
  ```
* **Linux**

  ```bash
  curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x kubectl
  sudo mv kubectl /usr/local/bin/
  ```
* **Windows (choco)**

  ```powershell
  choco install kubernetes-cli
  ```

설치 확인:

```bash
kubectl version --client
```

---

### Skaffold 설치

* **macOS**

  ```bash
  brew install skaffold
  ```
* **Linux**

  ```bash
  curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64
  chmod +x skaffold
  sudo mv skaffold /usr/local/bin/
  ```
* **Windows (choco)**

  ```powershell
  choco install skaffold
  ```

설치 확인:

```bash
skaffold version
```

정
