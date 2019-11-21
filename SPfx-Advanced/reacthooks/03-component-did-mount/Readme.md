# 03 Component Did Mount

Leer del estado y actualizarlo en un componente funcional es algo genial,
pero nos falta otra parte importante de los componentes de la clase, ¿qué pasa con
controladores de eventos de ciclo de vida como _componentDidMount_? ¿Cómo podemos conectarnos a un evento?
así en un componente funcional? _React.useEffect_ es tu amigo.

# Steps

- Tomaremos como punto de partida la muestra _00 boilerplate_. Copie el contenido de la
   proyecte en una carpeta nueva y ejecute _npm install_.

```bash
npm install
```

- Abrimos el fichero _./src/webparts/{nombredenuestrowebpart}/hooks/demo1.tsx_

```tsx
import * from React from "react";

export const MyComponent = () => {
  const [username, setUsername] = React.useState("");

  return (
    <>
      <h4>{username}</h4>
      <input value={username} onChange={e => setUsername(e.target.value)} />
    </>
  );
};
```

-Si ejecutamos la muestra, no se mostrará nada (el nombre está vacío), ¿qué pasa si queremos
   asignar algún valor justo cuando el componente está montado? Podemos hacer uso de
   _React.useEffect_ pasando como segundo argumento una matriz vacía (eso es importante
   si no pasamos esto, el código dentro del _useEffect_ se ejecutará en
   montar y después de cada render).

_./src/demo.js_

```diff
import * as React from 'react';

export const MyComponent = () => {
  const [username, setUsername] = React.useState("");

+  React.useEffect(() => {
+    setUsername("Hulk");
+  }, []);

  return (
    <>
      <h4>{username}</h4>
      <input value={username} onChange={e => setUsername(e.target.value)} />
    </>
  );
};
```

- Ahora si ejecutamos el ejemplo nos mostrará _Hulk_ como nombre de usuario.

* Vamos un paso más allá, simulemos una llamada asincrónica (lo haremos
   usando _setTimeout_)



```diff
import * as React from 'react';

export const MyComponent = () => {
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
-    setUsername("Hulk");
+    // Simulating async call
+    setTimeout(() => {
+      setUsername("Hulk");
+    }, 1500);
  }, []);

  return (
    <>
      <h4>{username}</h4>
      <input value={username} onChange={e => setUsername(e.target.value)} />
    </>
  );
};
```
- Ahora _Hulk_  se mostrará despues de 1,5 segundos, en lugar de usar  _setTimeout_ podeis usar _fetch_ o cualquier otra opción similar para realizar peticiones Ajax.



