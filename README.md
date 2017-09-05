# Enonic XP Vanilla Starter
Velkommen til Enonic XP. Dette repoet inneholder kildekode og byggeskripter for å bygge og deploye en jar-fil som kan lastes inn i Enonic XP.  

## Mappestruktur
Vi anbefaler en mappestruktur for utvikling som er slik:

```
dev
    software
        enonic
            enonic-xp-x.x.x
    code
        myapp
    xp-homes
        delta
            home
```

Dette repoet klones inn i ~/dev/code.

## Installere Enonic XP
Last ned [siste versjon](https://enonic.com/try-now#download-now) og pakk ut zip-filen i ~/dev/software/enonic.

## Java
Enonic XP krever [Java 8 JDK eller JRE](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installert. JAVA_HOME må være definert korrekt. For OSX vil dette normalt være /Library/Java/JavaVirtualMachines/jdk1.8.x_xx.jdk/Contents/Home

## XP_HOME
Enonic XP trenger at vi spesifiserer hvilken mappe som er "home"-mappen. Dette leses fra miljøvariabelen XP_HOME, eller defineres i build.gradle. Hvis du følger anbefalingen for filstruktur vil dette allerede være definert i build.gradle for deg.

## Bygge pakken
Vi bruker Gradle til byggverktøy. Gradle kan kjøres direkte fra kommandolinjen eller fra IntelliJ (eller annet IDE)

### Bygge fra kommandolinje
Bygg og deploy med default gradle wrapper:
> ~/dev/code/delta/gradlew deploy

Dette bygger .jar-filen og kopierer den deploy-mappen under $XP_HOME.

## Starte serveren
Når pakken er deployet kan du starte serveren. Serveren kan startes direkte fra gradle:
> gradlew startserver

Serveren vil være tilgjengelig på localhost:8080.

### VHOST
Legg dette inn i `~/dev/xp-homes/<myapp>/home/config/com.enonic.xp.web.vhost.cfg`

```
enabled = true

mapping.delta.host = localhost
mapping.delta.source = /
mapping.delta.target = /portal/master/<navnet på rotmappen i Content Studio>

mapping.admin.host = localhost
mapping.admin.source = /admin
mapping.admin.target = /admin
```

# Logger
Loggen er tilgjengelig i ~dev/software/enonic/logs/enonic-xp-x.x.x.log

Loggen blir tømt ved omstart av løsningen.
