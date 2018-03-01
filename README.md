# 🍿 HYPERTUBE 🚀

## Contributing

> **Warning:** You should never ever push to master 🙄

* One branch per feature 🤓
* Please explain how to launch your app (install dependancies & setup environment) 😚

## Functional architecture

![untitled diagram](https://user-images.githubusercontent.com/10537452/36034277-da0cd912-0db3-11e8-866a-8b33585b4e8d.png)

* Back-end API is responsible for whole application logic except downloading & streaming files 
* We should define contracts for communication between Stream API & back-end and between front-end app & back-end

## Docker-compose

> **This is a work in progress**

There is a working docker-compose

```bash
# To build images
$> docker-compose build
# And run all services
$> docker-compose up
```

The production environment should use postrgresql as DB, it is actually using sqlite3