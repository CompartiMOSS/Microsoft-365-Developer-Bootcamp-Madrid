## Trabajando con Graph y Microsoft Teams desde PowerShell

Para conectar con Graph desde PowerShell vamos a utilizar el [módulo PowerShell de PnP](https://github.com/SharePoint/PnP-PowerShell) y para ello utilizaremos el commando [Connect-PnPOnline](https://docs.microsoft.com/en-us/powershell/module/sharepoint-pnp/connect-pnponline?view=sharepoint-ps).

Para conectarnos tenemos 2 opciones, utilizar los permisos de una aplicación registrada en AzureAD, o bien, incluir directamente los scopes que vamos a necesitar en nuestro script.
```
Connect-PnPOnline -AppId $appId -AppSecret $appSecret -AADDomain $appDomain
Connect-PnPOnline -Scopes $scopes
```
En los siguientes ejemplos utilizaremos la segunda opción por comodidad

### Obtener mis Teams
1. Abre PowerShell ISE
1. Crea un nuevo fichero ps1
1. Dentro del fichero escribimos 

    ```
    $scopes = 'Group.Read.All'
    Connect-PnPOnline -Scopes $scopes
    $accesstoken = Get-PnPAccessToken
    $url = "https://graph.microsoft.com/v1.0/me/joinedTeams"
    $myTeams = (Invoke-RestMethod -Uri $url -Method Get -Headers @{Authorization = "Bearer $accesstoken"}).value

    $myTeams

    ```
1. Ejecutamos el script

### Obtener todos los teams de un tenant y sus usuarios

1. Abre PowerShell ISE
1. Crea un nuevo fichero ps1
1. Dentro del fichero vamos a crear función para obtener los Teams de un tenant
    ```
    function Get-AllTeams {
        param([string]$token)
        
        $url = "https://graph.microsoft.com/beta/groups?`$filter=resourceProvisioningOptions/Any(x:x eq 'Team')"
        $response = Invoke-RestMethod -Uri $url -Headers @{Authorization = "Bearer $token"}
        $response.value
    }
    ```
1. creamos otras dos funciones para obtener los miembros y propietarios
    ```
    function Get-TeamOwners {
        param([string]$token, [System.Guid] $teamID)
        
        $url = "https://graph.microsoft.com/v1.0/groups/" + $teamID + "/owners"
        $response = Invoke-RestMethod -Uri $url -Headers @{Authorization = "Bearer $token"}
        
        return $response.value | ToArray
    }

    function Get-TeamMembers {
        param([string]$token, [System.Guid] $teamID)
        
        $url = "https://graph.microsoft.com/v1.0/groups/" + $teamID + "/members"
        $response = Invoke-RestMethod -Uri $url -Headers @{Authorization = "Bearer $token"}
        
        return $response.value | ToArray
    }
    ```

1. Creamos una función auxiliar para convertir la entrada en un array
    ```
    function ToArray
    {
    begin
    {
        $output = @();
    }
    process
    {
        $output += $_;
    }
    end
    {
        return ,$output;
    }
    }
    ```

1. Añadimos el siguiente código para obtener los resultados
    ```
    $scopes = 'Group.Read.All'
    Connect-PnPOnline -Scopes $scopes

    $token = Get-PnPAccessToken

    $teams = Get-AllTeams $token

    $result = @()

    foreach($team in $teams) {
        $owners = Get-TeamOwners $token $team.id
        $members = Get-TeamMembers $token $team.id
        $guests = $members | where {$_.userPrincipalName -like '*#EXT#*'}

        $teamToAdd = "" | Select-Object "TeamId","TeamName","Owners","Members","Guests"
        $teamToAdd.TeamId = $team.id
        $teamToAdd.TeamName = $team.displayName
        $teamToAdd.Owners = $owners.count
        $teamToAdd.Members = $members.count
        $teamToAdd.Guests = $guests.count

        $result += $teamToAdd
    }

    $result | Format-Table
    ```
1. Ejecutamos el script

### Obtener un inventario de Teams, canales y pestañas

1. Abre PowerShell ISE
1. Crea un nuevo fichero ps1
1. Dentro del fichero vamos a crear función para obtener los Teams de un tenant
    ```
    function Get-AllTeams {
        param([string]$token)
        
        $url = "https://graph.microsoft.com/beta/groups?`$filter=resourceProvisioningOptions/Any(x:x eq 'Team')"
        $response = Invoke-RestMethod -Uri $url -Headers @{Authorization = "Bearer $token"}
        $response.value
    }
    ```

1. Creamos una función para obtener los canales de un Team
    ```
    function Get-TeamChannels {
        param([string]$token, [System.Guid] $teamID)
        
        $url = "https://graph.microsoft.com/v1.0/teams/" + $teamID + "/channels"
        $response = Invoke-RestMethod -Uri $url -Headers @{Authorization = "Bearer $token"}
        $response.value
    }
    ```
1. Creamos una función para obtener las pestañas de un canal
    ```
    function Get-TeamChannels {
        param([string]$token, [System.Guid] $teamID)
        
        $url = "https://graph.microsoft.com/v1.0/teams/" + $teamID + "/channels"
        $response = Invoke-RestMethod -Uri $url -Headers @{Authorization = "Bearer $token"}
        $response.value
    }
    ```
1. Añadimos el siguiente código para obtener los resultados
    ```
    $scopes = 'Group.Read.All'
    Connect-PnPOnline -Scopes $scopes
    $token = Get-PnPAccessToken
    $teams = Get-AllTeams $token
    $channels = @()
    foreach($team in $teams) {
        $teamChannels = Get-TeamChannels $token $team.id
        foreach($channel in $teamChannels) {
            $channelToAdd = "" | Select-Object "TeamId","TeamName","ChannelId","ChannelName", "ChannelTabs"
            $channelToAdd.TeamId = $team.id
            $channelToAdd.TeamName = $team.displayName
            $channelToAdd.ChannelId = $channel.id
            $channelToAdd.ChannelName = $channel.displayName
            $channelTabs = Get-ChannelTabs $token $team.id $channel.id
            $channelToAdd.ChannelTabs = $channelTabs
            $channels += $channelToAdd
        }
    }
    ```
1. Ejecutamos el script

### Creando Teams y canales desde PowerShell

1. Abre PowerShell ISE
1. Crea un nuevo fichero ps1
1. Dentro del fichero escribimos el siguiente código para conectarnos a Office y obtener el token

    ```
    $arrayOfScopes = @("Group.ReadWrite.All", "AppCatalog.ReadWrite.All")

    Connect-PnPOnline -Scopes $arrayOfScopes
    $accessToken = Get-PnPAccessToken

    $headers = @{
        "Content-Type" = "application/json"
        Authorization = "Bearer $accessToken"
    }
    ```
1. Creamos la peticion para crear un grupo de Office 365

    ```
    $createGroupRequest = @{
        displayName = "Bootcamp Madrid 2019"
        description = "Team Demo Bootcamp Madrid 2019"
        groupTypes = @("Unified")
        mailEnabled = $true
        mailNickName = "BootcampMadrid"
        securityEnabled = $false
        visibility = "Private"
    }
    $createGroupBody = ConvertTo-Json -InputObject $createGroupRequest

    $response = Invoke-RestMethod -Uri "https://graph.microsoft.com/v1.0/groups" -body $createGroupBody -Method	Post -Headers $headers -UseBasicParsing
    $groupId = $response.id
    ```

1. Creamos la petición para crear el Team

    ```
    $createTeamRequest = @{
        memberSettings = @{
            allowCreateUpdateChannels = $true
        }
        messagingSettings = @{
            allowUserEditMessages = $true
            allowUserDeleteMessages = $true
        }
        funSettings = @{
            allowGiphy = $true
            giphyContentRating = "strict"
        }
    }

    $createTeamBody = ConvertTo-Json -InputObject $createTeamRequest

    $response = Invoke-RestMethod -Uri "https://graph.microsoft.com/v1.0/groups/$groupId/team" -Body $createTeamBody -Method Put -Headers $headers -UseBasicParsing
    $teamId = $response.id
    ```

1. Creamos la petición para crear un canal

    ```
    $createChannelRequest = @{
    displayName = "xFx & Microsoft Graph"
    description = "xFx & Microsoft Graph: The API for Microsoft 365"
    }

    $createChannelBody = ConvertTo-Json -InputObject $createChannelRequest
    Invoke-RestMethod -Uri "https://graph.microsoft.com/v1.0/teams/$teamId/channels" -Body $createChannelBody -Method Post -Headers $headers -UseBasicParsing
    ```

1. Ejecutamos el script