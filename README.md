# Образовательная платформа PSB Campus
Этот проект представляет собой прототип образовательной платформы, реализовывающий пользовательский сценарий студента. Внутри курса предствлены различные функции для оптимизации учебного процесса: чат с преподавателем, отслеживание прогресса, выполенение домашних заданий.

## Идея и концепция

### Современное обучение часто разорвано между разными сервисами:
почта, чаты, облака с файлами, отдельные таблицы с оценками. В результате теряются задания, сложно отследить прогресс и держать живой контакт между студентом и преподавателем.

### PSB Campus решает эту проблему:
- это единая веб-платформа, где в одном месте живут:

- курсы и учебные материалы,

- задания и загрузка домашних работ,

- комментарии и оценки,

- чат с преподавателем,

- визуальный прогресс студента.

*Визуально интерфейс построен как набор виджетов в стиле iOS-дешборда — блоки можно переставлять, добавлять “Заметки” и собирать своё удобное рабочее пространство под конкретный курс.*

## Установка
1.  Клонируйте репозиторий:
    ```bash
    git clone https://github.com/your-username/psb_campus.git
    cd PSB_campus
    ```
2.  Создайте и активируйте виртуальное окружение:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
3.  Установите необходимые библиотеки:
    ```bash
    pip install -r requirements.txt

4.  Перейдите в папку сервера:
    ```bash
    cd server

5.  Проверьте миграции:
    ```bash
    python manage.py makemigrations

6.  Примените миграции:
    ```bash
    python manage.py migrate

7.  В новом терминале перейдите в папку клиента:
    ```bash
    cd client

8.  Установите зависимости:
    ```bash
    npm install

9. Выполните сборку:
    ```bash
    npm run build

10. Запустите в режиме разработки:
    ```bash
    npm start

11. Запустите сервер:
    ```bash
    python manage.py runserver
    ```

## Технологический стек 

### Backend:

- Python, Django + Django REST Framework;

- SQLite (для прототипа);

- REST API для:

  - курсов и учебных материалов,

  - заданий,

  - отправки работ и загрузки файлов,

  - комментариев и чата,

  - оценок и статуса прогресса.

### Frontend:

- React + react-router-dom;

- Axios для общения с API;

- кастомный дизайн (CSS) в едином визуальном стиле: темная тема, стеклянные карточки, неоновые акценты;

- drag-and-drop виджетов (hello-pangea/dnd).

## Версии 
### Backend
- Django==5.2.8
- djangorestframework==3.15.1
- django-cors-headers==4.4.0
- Pillow==10.3.0
### Frontend
- "react": "^19.2.0"
- "react-dom": "^19.2.0"
- "react-router-dom": "^7.9.6"
- "react-scripts": "5.0.1"


## Структура проекта
### Backend (Django)
-    `/server/`: Корневая папка бэкенда

-    `/server/app/`: Основное Django приложение

-    `/server/app/migrations/`: Миграции базы данных

-    `/server/app/models.py`: Модели данных (Person, Course, Assignment, Submission)

-    `/server/app/views.py`: API endpoints и бизнес-логика

-    `/server/app/serializers.py`: Сериализаторы для REST API

-    `/server/app/urls.py`: URL маршруты приложения

-    `/server/app/admin.py`: Настройки админ-панели Django

-    `/server/psb_campus/`: Настройки проекта Django

-    `/server/psb_campus/settings.py`: Конфигурация Django

-    `/server/psb_campus/urls.py`: Главные URL маршруты

-   `-/server/manage.py`: Утилита управления Django

-    `/server/db.sqlite3`: База данных SQLite

-    `/server/requirements.txt`: Зависимости Python

### Frontend (React)
-    `/client/`: Корневая папка фронтенда

-    `/client/src/`: Исходный код React приложения

-    `/client/src/pages`: Компоненты страниц

-    `/client/src/pages/LoginPage.js`: Страница авторизации

-    `/client/src/pages/StudentDashboard.js`: Панель студента

-    `/client/src/pages/TeacherDashboard.js`: Панель преподавателя

-    `/client/src/pages/CoursePage.js`: Страница курса с материалами

-    `/client/src/pages/CourseTopicsPage.js`: Страница тем курса

-    `/client/src/components`: Переиспользуемые React компоненты

-    `/client/src/components/TopBar.js`: Верхняя панель навигации

-    `/client/src/services`: Сервисы для работы с API

-    `/client/src/services/api.js`: HTTP клиент для бэкенда
  
-    `-/client/src/App.js`: Главный компонент приложения

-    `/client/src/index.js`: Точка входа React приложения

  ## Команда разработчиков:
  - Воробьева Анастасия (backend-разработчик)
  - Викулова Яна (frontend-разработчик)
  - Адамокова Диана (frontend-разработчик)
  - Мазько Надежда (UX/UI-дизайнер)
