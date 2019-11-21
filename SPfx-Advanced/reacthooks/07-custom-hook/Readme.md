# 07 Custom hooks

Los Hooks son geniales, pero nuestro componente funcional parece desordenado, es
¿hay una manera de extraer la funcionalidad fuera del componente funcional?
y lo que es más importante es que hay alguna posibilidad de hacerla reutilizable para
otros componentes? Yups! Hooks Custom vienen para salvarnos la vida :)

# Steps

- Tomaremos como punto de partida la muestra _00 boilerplate_. Copie el contenido de la
   proyecte en una carpeta nueva y ejecute _npm install_.

```bash
npm install
```

- Abrimos el fichero _./src/webparts/{nombredenuestrowebpart}/hooks/demo1.tsx_


```tsx
import * as React from "react";

export const MyComponent = () => {
  const [filter, setFilter] = React.useState("");
  const [userCollection, setUserCollection] = React.useState([]);

  // Load full list when the component gets mounted and filter gets updated
  React.useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
      .then(response => response.json())
      .then(json => setUserCollection(json));
  }, [filter]);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

-  Ahora vamos a extraer la funcionalidad de carga + filtro en un hook personalizado
  lo implementaremos usando dos sabores.

A. Encapsulando tambien el  _UseEffect_

_./src/demo.js_

```diff
import * as  React from "react";

+ const useUserCollection = () => {
+  const [filter, setFilter] = React.useState("");
+  const [userCollection, setUserCollection] = React.useState([]);
+
+  // Load full list when the component gets mounted and filter gets updated
+  React.useEffect(() => {
+    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
+      .then(response => response.json())
+      .then(json => setUserCollection(json));
+  }, [filter]);
+
+  return {userCollection, filter, setFilter}
+ }

export const MyComponent = () => {
-  const [filter, setFilter] = React.useState("");
-  const [userCollection, setUserCollection] = React.useState([]);
+  const {userCollection, filter, setFilter} = useUserCollection();

-  // Load full list when the component gets mounted and filter gets updated
-  React.useEffect(() => {
-    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
-      .then(response => response.json())
-      .then(json => setUserCollection(json));
-  }, [filter]);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

B. Encapsulando sólo los estados más las funciones de carga (el componente será
responsable de decidir cuándo llamar a estos métodos)



```diff
import * as React from "react";

+ const useUserCollection = () => {
+  const [filter, setFilter] = React.useState("");
+  const [userCollection, setUserCollection] = React.useState([]);
+
+  const loadUsers = () => {
+    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
+      .then(response => response.json())
+      .then(json => setUserCollection(json));
+  }
+
+  return {userCollection, loadUsers, filter, setFilter}
+ }


export const MyComponent = () => {
+  const {userCollection, loadUsers, filter, setFilter} = useUserCollection();
+
+  React.useEffect(() => {
+    loadUsers();
+  }, [filter]);

-  const [filter, setFilter] = React.useState("");
-  const [userCollection, setUserCollection] = React.useState([]);

-  // Load full list when the component gets mounted and filter gets updated
-  React.useEffect(() => {
-    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
-      .then(response => response.json())
-      .then(json => setUserCollection(json));
-  }, [filter]);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

¿Que opción os parece mejor?



