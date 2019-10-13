import * as express from 'express';

const app: express.Application = express();
const port: number = 3000;
const publicDir: string = 'public';

app.use('/', express.static(publicDir));
app.listen(port, () => console.log(`Circio available on port ${port}`));