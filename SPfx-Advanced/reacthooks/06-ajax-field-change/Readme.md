# 06 Ajax field change

Partimos del siguiente escenario. Un usuario determinado puede introducir un nombre en un campo de entrada,
queremos realizar una llamada ajax cada vez que el usuario teclea un valor en la entrada
(devuelto la lista de nombres filtrados). ¿Como lo podemos hacer? Usando _useEffect_ indicando
en el segundo argumento, en lugar de una matriz vacía, el nombre del campo usado para activar
la llamada.

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

- Ahora varmos a lanzar una petición ajax cada vez que el usuario teclea en la entrada del filtro.



```diff
export const MyComponent = () => {
  const [filter, setFilter] = React.useState('');
  const [userCollection, setUserCollection] = React.useState([]);

+  // Load full list when the component gets mounted and filter gets updated
+  React.useEffect(() => {
+    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
+        .then(response => response.json())
+        .then(json => setUserCollection(json));
+  }, [filter]);

  return (
```

- Si ejecutamos la muestra podemos comprobar que cada vez que empezamos a escribir en la entrada
  se activa un ajax llamado que devuelve la lista de resultados filtrados por el filtro
  campo.


