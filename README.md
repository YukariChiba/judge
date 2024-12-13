# Judge: 裁判文书数据库

## data:

`magnet:?xt=urn:btih:c6aac12ebd697041ba60a8cba9f7326155921fae`

## backend:

> 要求至少 32G 以上内存，400G 以上存储空间。

> 需要 MongoDB，在 `backend/.env` 中修改连接字符串

> 建议对以下字段进行索引：
>  `case_id` `title` `court` `region` `type` `type_id` `judge_type` `judge_date` `publish_date` `person`

- 导入数据: `npm run process`
- API: `npm run api`

## frontend:

> 需要 API，在 `frontend/src/utils/api.js` 中修改 `api_endpoint`

- dev: `yarn dev`
- build: `yarn && yarn build`

## LICENSE

AGPL-3.0