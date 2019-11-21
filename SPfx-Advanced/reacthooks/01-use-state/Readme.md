# 01 Use State

Es un ejemplo básico de como utilizar solo el state en cun componente funcional, utilizando 
_React.useState_

# Pasos

- Obtenemos el punto de entrada que añadimos en el ejemplo _00 boilerplate_. Copiaremos el contenido del proyecto en una nueva carpeta y ejecutaremos  _npm install_.

```bash
npm install
```

- Dentro de la carpeta nos crearemos el siguiente fichero

_./src/webparts/{nombredenuestrowebpart}/hooks/demo1.tsx_

```diff
import * as React from 'react';
export const MyComponent = props => {
+    const [myName, setMyName] = React.useState('Hulk');

+    return(
+        <>
+            <h4>{myName}</h4>
+            <input
+                value={myName}
+                onChange={(e) => setMyName(e.target.value)}
+            />
+        </>
+    );
};
```
Ahora vamos al fichero que hemos creado en el apartado 0 y reemplazamos el render por la llamada a nuestra función quedando de la siguiente manera
```diff
import * as React from 'react';
import styles from './ReactHooks.module.scss';
import { IReactHooksProps } from './IReactHooksProps';
import {MyComponent} from '.././hooks/demo1';
export default class ReactHooks extends React.Component<IReactHooksProps, {}> {
  public render(): React.ReactElement<IReactHooksProps> {
    return (
      <MyComponent />
    );
  }
}
```
- Si ahora vamos a nuestro linea de comando ponemos 

```bash
gulp serve 
```
Veremos que se muestra el nombre (Hulk) 
  y puedes editarlo en el mismo componente funcional, no necesitamos un componente de clase
   para mantener el estado más, _React.useState_ hace toda la magia por ti.