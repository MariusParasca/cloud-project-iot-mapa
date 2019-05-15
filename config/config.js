module.exports = {
  "development": {
    "username": "root",
    "password": "iot-automation",
    "database": "iot_db",
    "dialect": "mysql",
    "port": 3307
  },
  "test": {
    "dialectOptions": {
      "socketPath": '/cloudsql/cloud-project-iot-mapa:europe-west1:iot-automation',
    },
    "username": "root",
    "password": "iot-automation",
    "database": "iot_db",
    "dialect": "mysql",
    "port": 3306
  },
  "production": {
    "dialectOptions": {
      "socketPath": '/cloudsql/cloud-project-iot-mapa:europe-west1:iot-automation',
    },
    "username": "root",
    "password": "iot-automation",
    "database": "iot_db",
    "dialect": "mysql",
    "port": 3306
  }
}
