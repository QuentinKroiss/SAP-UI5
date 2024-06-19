SAP UI5 Projekt für das SAP Fiori UI5 Seminar an der Hochschule München im Sommersemester 2024.
Aufbau der Applikation

Aufbau der Applikation:

![Diagramm](https://github.com/QuentinKroiss/SAP-UI5/assets/74529117/750bbb03-8d84-4b73-b7cb-d5ba2070b82b)

- Linke Seite der Split App ist die Master View: Zeigt die Bestellungen die über den OData Service empfangen werden in einer Liste
- Rechte SEite zeigt zuerst ein leeres Detail View Skeleton, sobald eine Bestellung aus dem Master View selektiert wird, werden die Infos der Bestellung in den View geladen.
- Durch einen Klick auf ein Item der Bestellung wird der OrderItemDetailView mit den Infos dieses Bestellitems geladen und in der rechten Seite der SplitApp angezeigt.
