# Self-hosted runner — permanent fix for the StatCan IP block

StatCan intermittently blocks **GitHub-hosted** runner IP ranges, so a data-viz
run that lands on a blocked IP dies at preflight (can't reach StatCan at all —
both the bulk endpoint and the WDS API live on the same host). A runner on a
**residential IP** is never on that blocklist, so the block simply can't happen.

The pipeline is already wired for it: `chart-pipeline.yml` takes a `runner`
input (default `ubuntu-latest`). Once your runner is online, each topic opts in
with one line.

## Sequence

1. **Merge the `runner` input to `main`.** The reusable workflow is consumed
   `@main`, so the `runner` input on branch `claude/self-hosted-runner` must be
   merged before any caller can pass it. (Nothing changes until a caller sets it,
   so this merge is safe on its own.)
2. **Set up the machine** (once).
3. **Register the runner** on each data-viz repo you want covered.
4. **Flip each topic** to `runner: self-hosted`.

## 1. Machine

Any always-on box on your **home/residential network** — a Raspberry Pi 4/5, an
old laptop running Ubuntu, or a mini-PC. **Linux is simplest** (matches the
pipeline's `apt` dependencies); a Mac works too but you'd install the C libraries
with `brew` instead of `apt`.

One-time system libraries (the pipeline skips `apt-get` on self-hosted runners,
so install these yourself once):

```bash
sudo apt-get update && sudo apt-get install -y \
  libcurl4-openssl-dev libssl-dev libxml2-dev \
  libgdal-dev libproj-dev libgeos-dev libudunits2-dev \
  libfontconfig1-dev libcairo2-dev libfreetype6-dev \
  libharfbuzz-dev libfribidi-dev libtiff-dev libjpeg-dev libpng-dev \
  git curl
```

R itself is installed per-run by the `setup-r` action, and R packages persist in
the runner's library between runs (so only the first run is slow).

## 2 & 3. Register the runner (per repo)

Because this is a **user account** (not an org), runners attach per-repository.
Register the same machine on each data-viz repo you want block-proof — running
several lightweight runner instances on one box is fine.

For each repo (`gdp-data-viz`, `employment-data-viz`, `trade-data-viz`, …):

1. Open `https://github.com/mokhtartabari/<repo>/settings/actions/runners/new`
   (Linux x64). GitHub shows a download + `config.sh` block with a one-time token.
2. Put each repo's runner in its own folder so they don't collide:

```bash
mkdir -p ~/runners/<repo> && cd ~/runners/<repo>
# paste GitHub's download commands for this repo, then:
./config.sh --url https://github.com/mokhtartabari/<repo> \
            --token <TOKEN-FROM-GITHUB> \
            --name <repo>-home --labels self-hosted --unattended
sudo ./svc.sh install && sudo ./svc.sh start   # run as a background service
```

Repeat per repo (a small shell loop over the repo list makes this quick). `svc.sh`
keeps the runner up across reboots.

## 4. Flip each topic to the self-hosted runner

After the runner shows **Idle** in the repo's Actions → Runners page, add one
line to that repo's `.github/workflows/production_<topic>.yml`, under the
`with:` block that calls the reusable workflow:

```yaml
    with:
      topic: gdp
      # …existing inputs…
      runner: self-hosted     # ← run on the residential-IP machine
```

That's it — that topic now renders on your machine and the StatCan block can no
longer touch it. Leave a topic's line off to keep it on GitHub-hosted runners.

## Notes

- **Don't set `runner: self-hosted` before the runner is online** — the job would
  queue forever waiting for a matching runner. Register first, flip second.
- Keep the machine and its network reasonably reliable; if it's off when a
  release-day dispatch fires, that run waits until it's back (data just lags).
- The GitHub-hosted path still works as-is for any topic you don't flip, and the
  existing preflight + auto-retry remain the fallback there.
