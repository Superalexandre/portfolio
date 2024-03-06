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
    - [ ] Delete stations
    - [ ] Add the posibility to cancel
- [ ] Create a train
- [ ] Move the train
- [ ] Create random passengers
- [ ] Add the zoom feature
- [ ] Improve structure
    - [ ] Rename "point(s)" in "station(s)" 
    - [ ] Better function
        - [ ] drawLine, drawPoint should only draw
        - [ ] drawRandomPoints should call drawPoint to draw and only generate coord
    - [ ] Split function into files (line.ts, station.ts, train.ts)