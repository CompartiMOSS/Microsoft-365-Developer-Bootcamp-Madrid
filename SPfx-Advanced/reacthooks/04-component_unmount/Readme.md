# 04 Component unmount

Cuando trabajamos con el componente Clase, había una forma de liberar recursos (p. Ej.
una conexión de socket, o atrapar coordenadas de mouse x, y ...) cuando el componente
fue desmontado (componentWillUnMount), ¿hay alguna manera de hacer algo como
que usando Hooks? La respuesta es sí, incluyendo más escenarios 

# Steps

- Tomaremos como punto de partida la muestra _00 boilerplate_. Copie el contenido de la
   proyecte en una carpeta nueva y ejecute _npm install_.

```bash
npm install
```

- Abrimos el fichero _./src/webparts/{nombredenuestrowebpart}/hooks/demo1.tsx_

-  esta vez crearemos un componente padre
   y un componente hijo, el componente hijo será montado / desmontado por
   haciendo clic en un botón en el componente principal.

En el componente hijo haremos uso de _React.useEffect_ y usaremos
como segundo parámetro una matriz vacía para asegurar que el código que
llamado por _useEffect_ solo se ejecutará cuando el componente esté montado.



```tsx
import * as  React from "react";

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

  React.useEffect(() => {
    console.log("called when the component is mounted");
  }, []);

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

- ¿Qué se puede hacer para ejecutar un código justo cuando el componente está desmontado?
   Solo necesitamos devolver una función dentro de la entrada _useEffect_, haciendo esto
   la función se ejecutará cuando el componente esté desmontado (ya que
   están usando como segundo parámetro una cadena vacía)..



```diff
  React.useEffect(() => {
    console.log("called when the component is mounted");

+    return () => console.log('Called on component unmounted, check the [] on the react use effect');
  }, []);
```

- Si ejecuta la muestra y abre la consola del navegador, puede hacerlo siempre que hagamos clic para
   ocultar el componente hijo, se ejecutará la función _unmounted_ y el mensaje
   se mostrará en el registro de la consola del navegador..


