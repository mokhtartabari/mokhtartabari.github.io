#!/usr/bin/env bash
# setup-mac-runner.sh — one-shot: register this Mac as a self-hosted GitHub
# Actions runner on every *-data-viz repo, so chart renders run on your
# residential IP (which StatCan never blocks). Run once in Terminal:
#
#     bash setup-mac-runner.sh
#
# Requirements: Homebrew (https://brew.sh) and the GitHub CLI signed in as you.
set -euo pipefail

OWNER="mokhtartabari"
REPOS=(gdp-data-viz employment-data-viz trade-data-viz inflation-data-viz
       productivity-data-viz housing-data-viz energy-data-viz rates-data-viz)

echo "==> Checking prerequisites"
command -v brew >/dev/null || { echo "Install Homebrew first: https://brew.sh"; exit 1; }
command -v gh   >/dev/null || brew install gh
gh auth status >/dev/null 2>&1 || gh auth login

echo "==> Installing the C libraries the R packages compile against (one-time)"
# Non-fatal: most of these are usually already present, and the runner
# registration below doesn't need them. If Homebrew's prefix isn't writable,
# fix it once with:  sudo chown -R "$(whoami)" "$(brew --prefix)"
if [ -w "$(brew --prefix)" ]; then
  brew install curl openssl@3 libxml2 gdal proj geos udunits \
               fontconfig cairo freetype harfbuzz fribidi libtiff jpeg libpng pkg-config || \
    echo "   (some libraries failed to install — continuing; R can still compile with what's present)"
else
  echo "   (Homebrew prefix not writable — skipping lib install. Fix later with:"
  echo "      sudo chown -R \"$(whoami)\" \"$(brew --prefix)\"  )"
fi

echo "==> Downloading the macOS runner"
VER=$(gh api repos/actions/runner/releases/latest --jq .tag_name | sed 's/^v//')
ARCH=$([ "$(uname -m)" = "arm64" ] && echo arm64 || echo x64)
PKG="$HOME/actions-runner-pkg/runner.tar.gz"
mkdir -p "$HOME/actions-runner-pkg"
[ -f "$PKG" ] || curl -fsSL -o "$PKG" \
  "https://github.com/actions/runner/releases/download/v${VER}/actions-runner-osx-${ARCH}-${VER}.tar.gz"

echo "==> Registering + starting a runner per repo"
for repo in "${REPOS[@]}"; do
  dir="$HOME/runners/$repo"
  mkdir -p "$dir"; tar xzf "$PKG" -C "$dir"
  token=$(gh api -X POST "repos/$OWNER/$repo/actions/runners/registration-token" --jq .token)
  ( cd "$dir"
    ./config.sh --url "https://github.com/$OWNER/$repo" --token "$token" \
                --name "$(hostname -s)-$repo" --labels self-hosted --unattended --replace
    sudo ./svc.sh install "$(whoami)"
    sudo ./svc.sh start )
  echo "   ✓ $repo — runner installed and started"
done

echo
echo "Done. In each repo's Settings → Actions → Runners you should see a runner marked 'Idle'."
echo "Tell Claude they're online and it will flip the topics to runner: self-hosted."
