# A reader's note-taking companion app

### [demo](https://isms-test.herokuapp.com/)
- username: testuser
- password: test

## Running the app locally

### Step 1:  Install packages

```
npm install
```

### Step 2: Complete One of the below run options

### Step 3: Visit http://localhost:3000




----

### Run Options

#### Option 1: Running with npm

##### Set env vars

```
export DATABASE_URL=yourmongodburl
# username should already be set to your system username
export PASSWORD=yourpassword
```

##### Run with npm

```
npm start
```

#### Option 2: Running with heroku

##### Install heroku (from https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)

```
sudo add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"
curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install heroku
```

##### Create a heroku .env file at the probject root

```
DATABASE_URL=yourmongodburl
USERNAME=yourusername
PASSWORD=yourpassword
```

##### Run the app

```
heroku local
```

