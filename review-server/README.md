# Review sync server

Lets reviewers using review mode (`/review/` on the course site) see each other's comments
as they're made. Without it, review mode still works: comments stay in each reviewer's
browser and are shared by downloading and loading review files.

One file, `server.js`, with no dependencies. It needs Node 22.13 or newer, which has SQLite
built in. All comments live in one SQLite file.

## What it does

| Request | Needs | Result |
|---|---|---|
| `GET /marks` | `X-Review-Key` | every comment |
| `PUT /marks/:id` | key + `X-Review-Owner` | save; 403 if someone else made it |
| `DELETE /marks/:id` | key + `X-Review-Owner` | delete; 403 if someone else made it |
| `GET /events?key=` | key | a live stream of saves and deletes |
| `GET /health` | nothing | `ok` |

`X-Review-Key` is the shared review passcode. A wrong or missing passcode gets a 401.
`X-Review-Owner` is a random secret each browser makes for itself. Only a hash of it is
stored, so a reviewer can change only their own comments.

## Settings

| Variable | Default | |
|---|---|---|
| `REVIEW_KEY` | required | the passcode reviewers type on the /review/ page |
| `PORT` | `8090` | |
| `HOST` | `127.0.0.1` | keep it local and put Caddy in front |
| `REVIEW_DB` | `./tools/review.db` | the SQLite file; its folder is created if missing |
| `REVIEW_ORIGINS` | `http://localhost:8318,http://localhost:8080` | sites allowed to call it, comma-separated |

## Running it locally

```bash
npm run review-server
```

The passcode is `review` unless you set `REVIEW_KEY`, and the database goes in `tools/`
(git-ignored). On the site's `/review/` page, choose **Shared server**, set the address to
`http://127.0.0.1:8090` and the passcode to `review`.

## Deploying on Ubuntu

1. Install Node 22.13 or newer (`node --version` to check).

2. Copy this folder to the server:

   ```bash
   sudo mkdir -p /opt/aids-review
   sudo cp server.js package.json /opt/aids-review/
   ```

3. Create `/etc/systemd/system/aids-review.service`:

   ```ini
   [Unit]
   Description=Course review sync server
   After=network.target

   [Service]
   ExecStart=/usr/bin/node /opt/aids-review/server.js
   Environment=REVIEW_KEY=choose-a-passcode
   Environment=REVIEW_DB=/var/lib/aids-review/review.db
   Environment=REVIEW_ORIGINS=https://edc-aicc.github.io
   DynamicUser=yes
   StateDirectory=aids-review
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

   Then:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now aids-review
   curl http://127.0.0.1:8090/health
   ```

4. Put it behind Caddy. Pick one.

   **Its own subdomain.** Add a DNS A record for `reviews.kellerflint.com` pointing at the
   server, then add to the Caddyfile:

   ```
   reviews.kellerflint.com {
       reverse_proxy 127.0.0.1:8090 {
           flush_interval -1
       }
   }
   ```

   **A path on the existing site.** No DNS change. Inside the existing
   `courses.kellerflint.com { … }` block:

   ```
   handle_path /review-api/* {
       reverse_proxy 127.0.0.1:8090 {
           flush_interval -1
       }
   }
   ```

   `flush_interval -1` keeps the live stream from being buffered. Reload with
   `sudo systemctl reload caddy`.

5. Point the course site at it by setting `reviewServer` in `src/_data/site.json` to
   `https://reviews.kellerflint.com` or `https://courses.kellerflint.com/review-api`, then
   push. Reviewers then only type the passcode.

## Day to day

- **Change the passcode:** edit `REVIEW_KEY` in the service file, then
  `sudo systemctl daemon-reload && sudo systemctl restart aids-review`. Tell reviewers the
  new one.
- **Back up:** copy `/var/lib/aids-review/review.db`.
- **See every comment:** `sqlite3 /var/lib/aids-review/review.db "select data from marks"`,
  or load the site's `/review/` page in sync mode.
- **Logs:** `journalctl -u aids-review`.
