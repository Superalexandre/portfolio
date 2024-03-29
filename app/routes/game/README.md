# 🎮 Game

Inspired by [Mini Metro](https://store.steampowered.com/app/287980/Mini_Metro/), this game is a relaxing yet challenging experience where you design and manage a subway system for a growing city. Create lines, manage stations, and upgrade your network to keep up with demand. With additional features like events and challenges, this game will keep you entertained for hours on end.

# Name ideas
- Tiny Metro
- Little Lines
- Tiny Tracks

# 📝 TODO : 

- [ ] Save the game in the database
    - [ ] Need to be logged in
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
    - [X] Delete lines
    - [X] Add the possibility to cancel
- [X] Create a train
- [X] Move the train
- [ ] Link multiple stations (create a big line)
    - [X] Optimize the path if not changed no need to recalculate
    - [ ] Drag and drop to move a line and connect it to another station
- [X] Bugs
    - [X] When building a station you can delete lines
    - [X] If the lines make a "circle" the train go back when it can go straight
    - [ ] Creating a lot of stations make the train disappear (loop ?)
    - [ ] If the train is in "reverse" and we create a line it goes back
    - [ ] If two (or more) lines have the same path they overlap (+10 px ?)
    - [ ] When creating a line we can link to a station who already have a line (image : Bug 0)
    - [ ] When a line is looped we can't break the loop
- [ ] Create random passengers
- [X] Add a seed system
- [X] Add the zoom feature
- [ ] Future features [Long term]
    - [ ] Add shortcuts
        - [ ] Escape to undo
        - [ ] Space to pause
        - [ ] + and - to change the speed
        - [ ] 1, 2, 3 game speed
        - [ ] Custom shortcuts ?
            - [ ] Z/W to go up
            - [ ] S to go down
            - [ ] Q/A to go left
            - [ ] D to go right
    - [ ] Add rivers
    - [ ] Add mountains
    - [ ] Add events
        - [ ] Earthquake
        - [ ] Big event
            - [ ] Football match
            - [ ] Concert
            - [ ] Festival
    - [ ] Add challenges
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
