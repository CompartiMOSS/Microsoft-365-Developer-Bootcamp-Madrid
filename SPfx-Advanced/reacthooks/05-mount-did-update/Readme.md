# 05 Mount and Did Update events

¿Qué pasa si queremos ejecutar algún código cuando el componente se monta?
y después de cualquier actualización? React. UseEffect tiene más opciones disponibles disponibles.

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
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      {visible && <MyChildComponent />}
      <button onClick={() => setVisible(!visible)}>
        Toggle Child component visibility
      </button>
    </>
  );
}

const MyChildComponent = () => {
  const [userInfo, setUserInfo] = React.useState({
    name: "John",
    lastname: "Doe"
  });

  return (
    <div>
      <h3>
        {userInfo.name} {userInfo.lastname}
      </h3>
      <input
        value={userInfo.name}
        onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
      />
      <input
        value={userInfo.lastname}
        onChange={e => setUserInfo({ ...userInfo, lastname: e.target.value })}
      />
    </div>
  );
};
```

- Ahora viene la parte interesante llamando a _React.useEffect_ sin segundo
  el código dentro de _useEffect_ se activará justo cuando el parámetro
  está montado y en cualquier actualización (la función de limpieza se llamará
  justo antes de que se vuelva a activar el efecto).


```diff
const MyChildComponent = () => {
  const [userInfo, setUserInfo] = React.useState({
    name: "John",
    lastname: "Doe"
  });

+ React.useEffect(() => {
+    console.log("A. Called when the component is mounted and after every render");
+
+    return () =>
+      console.log(
+        "B. Cleanup function called after every render"
+      );
+  });

  return (
```
- Si iniciamos el proyecto y abrimos la consola del navegador podemos comprobar la opción
  comportamiento esperado.



