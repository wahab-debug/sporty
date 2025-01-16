# Sporty

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
"# sporty" 

***********************COMMANDS FOR GENERATING STUFF*****************
ng g class *classname* --type=model --skip-tests
ng g component *name* --skip-tests
ng generate service *name*



********************API end point Locations*************************
----------------------1- FixtureImages Controller----------
UploadImage()
GetImages()

-----------------------2- Game Controller ------------------
gameBySession()
getAllgames()
addGame()
gameAddToLatestSession()

-------------------------3- Matches Controller ---------------
getMatches()
setSchedule()
AllScheduledFixtures()
UpdateFixture()
startMatch()

-----------------------4- MatchEvents Controller --------------
AddMatchEvents()

-----------------------5- Player Controller -------------------
getTeamPlayers()
AddPlayer()
studentList()
getPlayerByTeamName()

----------------------6- Rule Controller ---------------------
viewRules()
updateRules()
viewRulesPerEM()

----------------------7- Scoring Controller-------------------
matchScores()
AddOrUpdateCricketScore()
UpdateCricketWinner()
AddOrUpdateGoalBasedScore()
UpdateGoalBasedWinner()
AddOrUpdatePointBasedScore()
UpdatePointBasedWinner()

----------------------8- Session Controller ------------------
sessionList()
currentSession()
sessionAdd()

---------------------9-  Team Controller --------------------
getTeams()
getByTeamId()
postTeam()
updateTeam()
AllTeamsByEM()
ApproveTeamById()
allowedTeams()

------------------10- User Controller ---------------------
UserList()
getById()
PostUser()
updateUser()
deleteUser()
getEventManagers()