# WebApp ToDO

## What do I have to do?

    - make a functional backend in "fastAPI"
    - make a functional frontend int "react"
    - document the procces (if possible)
    - make a functioning DockerFile (if possible)
    - Make a somewhat readable filesystem 
    - database????? - SPL Light ???? MySQL ?:??? --Jelszó: CsokiKeksz
    - use tailwind

### Backend:
How to start running the main.py:
```powershell
python -m venv venv
venv\Scripts\activate
python -m venv main.py
pxython main.py
```
To deactivate the virtual machien
```powershell
deactivate
```
To run fastAPI with uvicorn:
```powershell
uvicorn main:app --reload
```





### Activate Backend:

in Terminal inside backend folder
```powershell
.\.vevn\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```


### Activate Frontend:
 First activate venv in backend folder then
in Terminal inside frontend folder write

```powershell
.\.vevn\Scripts\Activate.ps1
npm install
npm run dev
```


#### DockerFile:
    - Builds React frontend
    - Copies the compiled static assets int FastApi app
    - Runs FastApi with venv
## Binding everything together: