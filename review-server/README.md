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
| `PUT /marks/:id` | key + `X-Review-Owner` + `X-Review-Reviewer` | save; 403 if someone else made it |
| `DELETE /marks/:id` | key + `X-Review-Owner` + `X-Review-Reviewer` | delete; 403 if someone else made it |
| `GET /events?key=` | key | a live stream of saves and deletes |
| `GET /health` | nothing | `ok` |

`X-Review-Key` is the shared review passcode. A wrong or missing passcode gets a 401.
`X-Review-Owner` is a random secret each browser makes for itself. Only a hash of it is
stored, so a reviewer can change only their own comments. `X-Review-Reviewer` is the browser's
reviewer id; it matters only for comments imported from review files (see below), which have no
secret yet.

## Settings

| Variable | Default | |
|---|---|---|
| `REVIEW_KEY` | required | the passcode reviewers type on the /review/ page |
| `PORT` | `8090` | |
| `HOST` | `127.0.0.1` | keep it local and put Caddy in front |
| `REVIEW_DB` | `./tools/review.db` | the SQLite file; its folder is created if missing |
| `REVIEW_ORIGINS` | `http://localhost:8318,http://127.0.0.1:8318,http://localhost:8080` | sites allowed to call it, comma-separated |

## Running it locally

```bash
npm run review-server
```

The passcode is `review` unless you set `REVIEW_KEY`, and the database goes in `tools/`
(git-ignored). With the site running (`npm start`), open
`http://localhost:8080/review/#server=http://127.0.0.1:8090&key=review`, a setup link that
switches that browser to the local server.

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

4. Put it behind an HTTPS reverse proxy. With Caddy, point a DNS record such as
   `reviews.example.com` at the server and add to the Caddyfile:

   ```
   reviews.example.com {
       reverse_proxy 127.0.0.1:8090 {
           flush_interval -1
       }
   }
   ```

   `flush_interval -1` keeps the live stream from being buffered. Reload with
   `sudo systemctl reload caddy`.

5. Check `reviewSync` is `true` in `src/_data/site.json`; that is what shows the **Shared
   server** option on `/review/`. The server's address never goes in the repo, since the site
   is public. On `/review/`, choose **Shared server**, enter the address and passcode, check
   **Test connection**, then **Copy setup link** and send that link privately to each
   reviewer. Opening it fills in both and switches their browser over. Comments they already
   made in that browser upload by themselves.

## Day to day

- **Change the passcode:** edit `REVIEW_KEY` in the service file, then
  `sudo systemctl daemon-reload && sudo systemctl restart aids-review`. Tell reviewers the
  new one.
- **Back up:** copy `/var/lib/aids-review/review.db`.
- **See every comment:** `sqlite3 /var/lib/aids-review/review.db "select data from marks"`,
  or load the site's `/review/` page in sync mode.
- **Logs:** `journalctl -u aids-review`.
- **Import review files** that people downloaded before the server existed:

  ```bash
  sudo REVIEW_DB=/var/lib/aids-review/review.db node /opt/aids-review/server.js import review-*.json
  ```

  Comments the server already has are skipped, so importing a file twice, or one whose
  author has since switched over, adds nothing. An imported comment can be changed only
  from the browser that made it, which takes it over on its first edit; anywhere else it's
  read-only. Open pages show the new comments after a reload.
