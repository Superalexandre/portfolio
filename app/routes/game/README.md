# 🎮 Game

Inspired by [Mini Metro](https://store.steampowered.com/app/287980/Mini_Metro/), this game is a relaxing yet challenging experience where you design and manage a subway system for a growing city. Create lines, manage stations, and upgrade your network to keep up with demand. With additional features like events and challenges, this game will keep you entertained for hours on end.

# 📝 TODO : 

- [ ] Save the game in the database
    - [ ] Need to be log
    - [ ] Create a schema
- [X] Create a game board
- [X] Create random stations
    - [X] Add random shape stations
        - [X] Square
        - [X] Circle
        - [X] Triangle
        - [X] Star  	
- [X] Connect stations
    - [X] Improve the connection with only straight line
    - [X] ❗ Delete lines
    - [X] Add the possibility to cancel
- [X] Create a train
- [X] Move the train
- [ ] ❗ Link multiple stations (create a big line)
- [ ] Create random passengers
- [ ] Add the zoom feature
- [X] Game time
    - [X] Pause
    - [X] Speed
        - [X] Slow
        - [X] Normal    
        - [X] Fast
- [X] Improve structure
    - [X] Rename "point(s)" in "station(s)" 
    - [X] Better function
        - [X] drawLine, drawPoint should only draw
        - [X] drawRandomPoints should call drawPoint to draw and only generate coord
    - [X] Split function into files (line.ts, station.ts, train.ts)
