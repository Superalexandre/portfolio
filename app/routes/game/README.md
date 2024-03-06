# Games

Main idea is to create a mini-metro game like

TODO: 
- [X] Create a game board
- [X] Create random stations
    - [ ] Add random shape stations
        - [X] Square
        - [ ] Circle
        - [ ] Triangle
        - [ ] Star  	
- [X] Connect stations
    - [ ] Improve the connection with only straight line
    - [ ] Delete lines
    - [X] Add the possibility to cancel
- [ ] Create a train
- [ ] Move the train
- [ ] Create random passengers
- [ ] Add the zoom feature
- [X] Improve structure
    - [X] Rename "point(s)" in "station(s)" 
    - [X] Better function
        - [x] drawLine, drawPoint should only draw
        - [x] drawRandomPoints should call drawPoint to draw and only generate coord
    - [X] Split function into files (line.ts, station.ts, train.ts)
