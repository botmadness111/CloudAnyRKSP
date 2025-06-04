# CloudAnyRKSP

Облачное хранилище файлов с возможностью создания комнат и совместного доступа к файлам.

## Структура проекта

```
CloudAnyRKSP/
├── src/                    # Исходный код проекта
│   └── main/              # Основной код приложения
│       ├── java/         # Java исходные файлы
│       │   └── ru/      # Пакет приложения
│       │       └── a/   # Основной пакет
│       │           ├── config/        # Конфигурации
│       │           ├── controller/    # REST контроллеры
│       │           ├── dto/          # Data Transfer Objects
│       │           ├── entity/       # JPA сущности
│       │           ├── repository/   # Репозитории для работы с БД
│       │           ├── service/      # Бизнес-логика
│       │           └── security/     # Безопасность и аутентификация
│       │
│       └── resources/    # Ресурсы приложения
│           ├── static/   # Статические файлы
│           ├── templates/# Шаблоны
│           └── application.properties # Конфигурация приложения
│
├── frontend/             # Frontend приложение (React + TypeScript)
│   ├── src/             # Исходный код
│   ├── public/          # Публичные файлы
│   └── package.json     # Зависимости frontend
│
├── target/              # Скомпилированные файлы
├── .gitignore          # Игнорируемые Git файлы
├── docker-compose.yml  # Конфигурация Docker Compose
├── Dockerfile         # Конфигурация Docker
├── mvnw              # Maven Wrapper для Unix
├── mvnw.cmd          # Maven Wrapper для Windows
└── pom.xml           # Конфигурация Maven
```

## Технологии

### Backend
* **Java 21**: Основной язык программирования
* **Spring Boot 3.2.5**: Фреймворк для создания веб-приложений
* **Spring Data JPA**: Работа с базой данных
* **Spring Security**: Безопасность и аутентификация
* **Liquibase**: Управление миграциями базы данных
* **JWT**: Аутентификация через токены
* **ModelMapper**: Маппинг объектов
* **Lombok**: Уменьшение шаблонного кода

### Frontend
* **React**: JavaScript библиотека для создания пользовательских интерфейсов
* **TypeScript**: Типизированный JavaScript
* **Vite**: Современный сборщик проектов
* **React Router**: Маршрутизация
* **Axios**: HTTP-клиент
* **Tailwind CSS**: CSS-фреймворк

### База данных
* **PostgreSQL**: Реляционная база данных
* **Render**: Облачный хостинг базы данных

### Инфраструктура
* **Docker**: Контейнеризация приложения
* **Docker Compose**: Оркестрация контейнеров
* **Maven**: Управление зависимостями и сборка
* **Git**: Система контроля версий
* **GitHub**: Хостинг репозитория

## Основные функции

### Пользователи
* Регистрация и аутентификация
* Управление профилем
* JWT-токены для безопасного доступа

### Комнаты
* Создание приватных и публичных комнат
* Управление доступом к комнатам
* Добавление/удаление пользователей
* Назначение администраторов

### Файлы
* Загрузка и скачивание файлов
* Организация файлов по комнатам
* Управление доступом к файлам
* Поддержка различных типов файлов

## API Документация

После запуска приложения, документация API доступна по адресу:
* Swagger UI: http://localhost:8080/swagger-ui.html
* OpenAPI: http://localhost:8080/v3/api-docs

## Запуск проекта

### Локальный запуск

1. Убедитесь, что у вас установлены:
   * Java 17 или выше
   * Maven
   * Node.js и npm (для frontend)

2. Создайте файл `src/main/resources/application.properties` с необходимыми настройками:
```properties
# База данных
spring.datasource.url=jdbc:postgresql://localhost:5432/cloudany
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
jwt.secret=your_secret_key
jwt.expiration=86400000

# Сервер
server.port=8080
```

3. Запустите backend:
```bash
./mvnw spring-boot:run
```

4. Запустите frontend:
```bash
cd frontend
npm install
npm run dev
```

### Запуск через Docker Compose

1. Создайте файл `.env` с необходимыми переменными окружения

2. Запустите контейнеры:
```bash
docker-compose up -d
```

## Разработка

### Создание миграций
```bash
./mvnw liquibase:diff
./mvnw liquibase:update
```

### Запуск тестов
```bash
./mvnw test
```

### Форматирование кода
```bash
./mvnw spotless:apply
```

## Лицензия

MIT 
