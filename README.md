# JSON Schema Builder

This is a web app to visually build and preview JSON schemas. You can add, remove, and reorder fields, and see the JSON output update in real time.

## What it does

- Lets you create a JSON schema by adding fields (String, Number, or Nested objects)
- You can nest fields as deep as you want
- Drag and drop to reorder fields
- Instantly see the generated JSON on the right
- Delete all fields with one click

## How to use

1. Run `npm install` to install dependencies
2. Run `npm start` to start the app
3. The app opens at [http://localhost:3000](http://localhost:3000)
4. Use the left panel to add/edit fields, and the right panel to see the JSON

## Tech stack

- React (with TypeScript)
- Ant Design for UI
- react-hook-form for form state
- react-beautiful-dnd for drag and drop