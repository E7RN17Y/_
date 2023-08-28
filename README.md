
## Processus de deployement
#### Build et demarrer les services
```docker
docker-compose up --build -d
```
#### Installation des dépendances
```docker
docker exec -it web supervisorctl restart composer:*
```
```docker
docker exec -it web supervisorctl restart npm:*
```

#### Executer les migrations
```docker
docker exec -it web supervisorctl restart migrate:*
```

#### Executer les seeders
```docker
docker exec -it web supervisorctl restart seeding:*
```

#### Executer le build
```docker
docker exec -it web supervisorctl restart build:*
```

#### Peupler la base de donnée pour la premiere fois
```docker
docker exec -it web supervisorctl restart feed_db-first-time-command:*
```

#### Lancer le planificateur de taches
```docker
docker exec -it web supervisorctl restart cronservice:*
```

#### Lancer le serveur web
```docker
docker exec -it web supervisorctl restart serve:*
```