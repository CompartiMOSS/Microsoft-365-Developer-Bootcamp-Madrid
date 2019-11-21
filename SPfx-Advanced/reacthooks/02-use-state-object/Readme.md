# 02 Use State Object

En la muestra anterior aprendimos cómo usar _useState_ para agregar estado
a un componente funcional. Acabamos de agregar un campo simple (cadena), pero qué
si queremos usar State en un objeto? ¿Cuál es el equivalente a la clase?
componente basado _SetState_? Tu amigo extendió el operador :), vamos a eso.

# Steps

- Tomaremos como punto de partida la muestra _00 boilerplate_. Copie el contenido de la
   proyecte en una carpeta nueva y ejecute _npm install_.

```bash
npm install
```

- Abrimos el fichero _./src/webparts/{nombredenuestrowebpart}/hooks/demo1.tsx_

```diff
import * as React from 'react';

export const MyComponent = props => {
+    const [userInfo, setUserInfo] = React.useState({
+       name: 'Hulk',
+       lastname: 'Avenger',
+    });

-  return <h2>My Component</h2>;
+    return(
+        <>
+            <h4>{userInfo.name} {userInfo.lastname}</h4>
+            <input
+                value={userInfo.name}
+                onChange={(e) => setUserInfo({
+                   ...userInfo,
+                    name: e.target.value
+                })}
+            />
+            <input
+                value={userInfo.lastname}
+                onChange={(e) => setUserInfo({
+                    ...userInfo,
+                    lastname: e.target.value
+                })}
+            />
+        </>
};
```

-  Ahora, si ejecuta la aplicación, puede verificar que puede actualizar ambas propiedades
   _name_ y _lastname_, puede asignar fácilmente un objeto para usar State, y en orden
   para actualizarlo, simplemente puede usar el operador extendido en lugar de usar
   _setState_.