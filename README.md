# WebKee
Read KeePass database on the web.

## Run Locally

**Clone the project**

```bash
git clone git@github.com:yudin101/webkee.git
```
### Frontend

```bash
cd webkee/frontend
```
**Install dependencies**

```bash
npm install
```

**Start the server**

```bash
npm run dev
```

Now, you should be able to see the frontend running on **http://localhost:5173**

### Backend

```bash
cd webkee/backend
```
**Create a virtual environment**

```bash
python3 -m venv .venv
```

**Activate virtual environment**

```bash
source .venv/bin/activate
```

**Install dependencies**

```bash
pip3 install -r requirements.txt
```

**Start the server**

```bash
python3 server.py
```
Now, you should be able to see the backend running on **http://localhost:5000**

## Contributing

Contributions are always welcome!

If you’d like to contribute to this project, you can:

- **Create an Issue**: Report bugs or suggest features by [creating an issue](https://github.com/yudin101/webkee/issues/new).
- **Open a Pull Request**: Submit code changes or improvements by [opening a pull request](https://github.com/yudin101/webkee/pulls).


## License

This project is licensed under the [MIT License](https://github.com/yudin101/webkee/blob/main/LICENSE).
