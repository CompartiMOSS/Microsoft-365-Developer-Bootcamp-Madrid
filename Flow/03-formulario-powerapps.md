# Personalización del formulario de Power Apps

En esta parte del laboratorio vamos a personalizar el formulario de entrada de datos en la lista de SharePoint con Microsoft Power Apps.

## Creación del formulario

Desde la lista de SharePoint deberemos hacer click en **Personalizar el formulario**.

![Personalizar el formulario desde SharePoint](./images/powerapps/Paso_01.png)

Seguidamente se abrirá Power Apps con el formulario que vamos a personalizar:

![Formulario de Power Apps](./images/powerapps/Paso_02.png)

## Modificación del formulario

En esta parte del ejercicio vamos a modificar el formulario con los cambios siguientes:

1. Hacer que el campo con el **número de solicitud** sea de solo lectura.

En primer lugar situaremos el campo en la parte superior del formulario:

![Cambiar orden de los campos en Power Apps](./images/powerapps/Paso_03_CambiarOrden.png)

A continuación deberemos **desbloquear el campo** para poder editarlo y hacerlo unicamente de lectura.

![Desbloquear un campo en Power Apps](./images/powerapps/Paso_04_DesbloquearCampo.png)

Finalmente haremos que el campo sea de solo lectura:

![Hacer que un campo sea solo de lectura Power Apps](./images/powerapps/Paso_05_SoloLectura.png)

2. Si el curso es gratuito, deberemos ocultar el campo **Precio**.

En primer lugar, deberemos desbloquear el campo, como hemos hecho anteriormente:

![Desbloquear un campo en Power Apps](./images/powerapps/Paso_06_DesbloquarPrecio.png)

Seguidamente haremos que al modificar el valor del campo **Gratuita** (evento _onCheck_) se actualice el valor de la variable **miVariable** que hemos creado previamente:

![Asignar un valor a una variable](./images/powerapps/Paso_07_Cambiar_OnChange.png)

Finalmente, haremos que la propiedad _Visible_ del campo **Precio** dependa del valor de la variable **miVariable**.

![Modificar la propiedad Visible de un control](./images/powerapps/Paso_08_VisibilidadPrecio.png)

3. Añadir una imagen al formulario.

Desplazaremos el conjunto de controles hacia la parte inferior del formulario, de forma que podamos añadir una imagen y una título:

![Desplazar controles](./images/powerapps/Paso_09_DesplazarControles.png)

Después añadiremos dos controles (**imagen** y **etiqueta**) para mostrar algo como esto:

![Añadir una imagen](./images/powerapps/Paso_12_TituloLogo.png)

## Publicación del Formulario

Para poder publicar el formulario, primero deberemos guardar los cambios:

![Guardar formulario](./images/powerapps/Paso_13_GuardarFormulario.png)

Y finalmente ya podremos publicarlo y hacerlo visible para el resto de usuarios:

![Publicar formulario](./images/powerapps/Paso_14_PublicarFormulario.png)

Si nos vamos a SharePoint y probamos a crear una nueva solicitud, el formulario modificado debería aparecer.
