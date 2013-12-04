
var fenFrame = {};

fenFrame.sectionPiece = function (lengthInternal, sizeWidth, endPrepType1, endPrepType2, options) {
    // Private Properties/Methods
    function _GetPeak(size, endPrep, sizeWidth, yNotchDepth, angle) {
        var m_result = 0;

        switch (endPrep) {
            case 1: m_result = 0;
                break;
            case 2: m_result += sizeWidth;
                break;
            case 3: m_result += (sizeWidth / 2);
                break;
            case 4:
            case 5: m_result += yNotchDepth;
                break;
            case 6: m_result += _getEndPrepAngleOffset(angle, this.sizeWidth);
                break;
        }
        return m_result;
    };

    function _getEndPrepAngleOffset(angle, width) {
        Math.degrees = function (rad) {
            return rad * (180 / Math.PI);
        };
        Math.radians = function (deg) {
            return deg * (Math.PI / 180);
        };
        return Math.round(width * Math.tan(Math.radians(90 - angle)));
    };


    function _stack() {
        this.stac = new Array();
        this.pop = function () {
            return this.stac.pop();
        };
        this.push = function (item) {
            this.stac.push(item);
        };
    }

    function _line(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    this.lengthInternal = lengthInternal;
    this.sizeWidth = sizeWidth;
    this.endPrepType1 = endPrepType1;
    this.endPrepType2 = endPrepType2;

    this.penColour = "#000000";
    this.fillColour = "#ffffff";
    this.yNotchDepth1 = Math.round(this.sizeWidth / 2);
    this.yNotchDepth2 = Math.round(this.sizeWidth / 2);

    var m_peakAddition = _GetPeak(this.lengthInternal, this.endPrepType1, this.sizeWidth, this.yNotchDepth1, this.endPrepAngle1);
    m_peakAddition += _GetPeak(this.lengthInternal, this.endPrepType2, this.sizeWidth, this.yNotchDepth2, this.endPrepAngle2);
    this.lengthPeak = this.lengthInternal + m_peakAddition;

    if (options) {
        this.rebateTop = options.rebateTop || 0;
        this.rebateBot = options.rebateBot || 0;
        this.lengthExternal = options.lengthExternal || 0;
        this.lengthPeak = options.lengthPeak || this.lengthInternal + m_peakAddition;
        this.penColour = options.penColour || this.penColour;
        this.fillColour = options.fillColour || this.fillColour;
        this.yNotchDepth1 = options.yNotchDepth1 || Math.round(this.sizeWidth / 2);
        this.yNotchDepth2 = options.yNotchDepth2 || Math.round(this.sizeWidth / 2);
        this.vNotches = options.vNotches || [];
        this.endPrepAngle1 = options.endPrepAngle1 || 0;
        this.endPrepAngle2 = options.endPrepAngle2 || 0;

        this.ApertureX = options.apertureX || 0;
        this.ApertureY = options.apertureY || 0;
        this.Component = options.component || "";
        this.EndPrepAbbreviation1 = options.endPrepAbbreviation1 || "";
        this.EndPrepAbbreviation2 = options.endPrepAbbreviation2 || "";
        this.StartX = options.startX || 0;
        this.StartY = options.startY || 0;
        this.EndX = options.endX || 0;
        this.EndY = options.endY || 0;
        this.StockCode = options.stockCode || "";
        this.StockDescription = options.stockDescription || "";
        this.Weight = options.weight || 0;
    };
    this.offSet = 0;


    this.endPrep = function (aStack, endPrepType, pos) {
        var m_sizeWidthHalf = Math.round(this.sizeWidth / 2);
        var m_startX = 0;
        var m_startY = 0;
        var m_endX = 0;
        var m_endY = 0;

        var m_x = 0;
        var m_y = 0;
        var m_tmp = 0;
        var m_tmp1 = 0;
        var m_tmp2 = 0;


        switch (endPrepType) {
            case 1:
                // Square 90
                if (pos == 1) {
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));
                } else if (pos == 2) {
                    m_x = this.offSet;
                    this.myStackPath.push(new _line(m_x, m_y));
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));
                }
                break;
            case 2:
                // Mitre 45
                if (pos == 1) {

                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));
                    m_x = this.sizeWidth;
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = this.sizeWidth - this.rebateTop.size;
                        m_startY = this.rebateTop.size;
                        m_endX = this.sizeWidth;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = this.rebateBot.size;
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    this.offSet = this.sizeWidth;
                } else if (pos == 2) {

                    m_x = this.offSet;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = this.offSet + this.sizeWidth;
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = this.offSet;
                        m_startY = this.rebateTop.size;
                        m_endX = this.offSet + this.rebateTop.size;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = this.offSet;
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endX = this.offSet + (this.sizeWidth - this.rebateBot.size);
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }
                    this.offSet += this.sizeWidth;
                }
                break;
            case 3:
                // Arrow Head
                if (pos == 1) {
                    m_x = m_sizeWidthHalf;
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));
                    m_y = m_sizeWidthHalf;
                    m_x = 0;
                    this.myStackPath.push(new _line(m_x, m_y));
                    m_x = m_sizeWidthHalf;
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = m_sizeWidthHalf - this.rebateTop.size;
                        m_endX = m_sizeWidthHalf;
                        m_startY = this.rebateTop.size;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = m_sizeWidthHalf - this.rebateBot.size;
                        m_endX = m_sizeWidthHalf;
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    this.offSet = m_sizeWidthHalf;
                } else if (pos == 2) {
                    m_x = this.offSet;
                    this.myStackPath.push(new _line(m_x, m_y));
                    m_x = this.offSet + m_sizeWidthHalf;
                    m_y = m_sizeWidthHalf;
                    this.myStackPath.push(new _line(m_x, m_y));
                    m_x = this.offSet;
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = this.offSet + this.rebateTop.size;
                        m_endX = this.offSet;
                        m_startY = this.rebateTop.size;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = this.offSet + this.rebateTop.size;
                        m_endX = this.offSet;
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }
                    this.offSet += m_sizeWidthHalf;
                }
                break;
            case 4:
                // Y Notch Top (Butt V Top)
                if (pos == 1) {
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_y = this.yNotchDepth1;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = this.yNotchDepth1;
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        if (this.rebateTop.size > this.yNotchDepth1) {
                            m_startX = 0;
                        } else {
                            m_startX = this.yNotchDepth1 - this.rebateTop.size;
                        }
                        m_startY = this.rebateTop.size;
                        m_endX = this.yNotchDepth1;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = 0;
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    this.offSet = this.yNotchDepth1;
                } else if (pos == 2) {
                    m_x = this.offSet;
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = this.offSet + this.yNotchDepth2;
                    m_y = this.yNotchDepth2;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {

                        m_startX = this.offSet;
                        m_startY = this.rebateTop.size;

                        if (this.rebateTop.size > this.yNotchDepth2) {
                            m_endX = this.offSet + this.yNotchDepth2;
                        } else {
                            m_endX = this.offSet + this.rebateTop.size;
                        }
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = this.offSet;
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endX = this.offSet + this.yNotchDepth2;
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }
                    this.offSet += this.yNotchDepth1;
                }
                break;
            case 5:
                // Y Notch Bot (Butt V Bot)
                if (pos == 1) {
                    m_y = this.sizeWidth;
                    m_x = this.sizeWidth - this.yNotchDepth1;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = 0;
                    m_y = this.sizeWidth - this.yNotchDepth1;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = 0;
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = 0;
                        m_startY = this.rebateTop.size;
                        m_endX = this.yNotchDepth1;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        if (this.rebateBot.size > this.yNotchDepth1) {
                            m_startX = 0;
                        } else {
                            m_startX = this.yNotchDepth1 - this.rebateBot.size;
                        }
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endX = this.yNotchDepth1;
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }
                    this.offSet = this.yNotchDepth1;

                } else if (pos == 2) {
                    m_x = this.offSet + this.yNotchDepth2;
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_y = this.sizeWidth - this.yNotchDepth2;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = this.offSet;
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = this.offSet;
                        m_startY = this.rebateTop.size;
                        m_endX = this.offSet + this.yNotchDepth2;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = this.offSet;
                        m_startY = this.sizeWidth - this.rebateBot.size;

                        if (this.rebateBot.size > this.yNotchDepth2) {
                            m_endX = this.offSet + this.sizeWidth;
                        } else {
                            m_endX = this.offSet + this.rebateBot.size;
                        }
                        m_endY = m_startY;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }
                    this.offSet += this.yNotchDepth1;
                }
                break;
            case 6:
                // Angle
                if ((!(this.endPrepAngle1 > 0)) || (!(this.endPrepAngle2 > 0))) {
                    throw "Invalid endPrepAngle";
                }

                if (pos == 1) {
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = _getEndPrepAngleOffset(this.endPrepAngle1, this.sizeWidth);
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = m_x - _getEndPrepAngleOffset(this.endPrepAngle1, this.rebateTop.size);
                        m_startY = this.rebateTop.size;
                        m_endX = m_x;
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = m_x - _getEndPrepAngleOffset(this.endPrepAngle1, this.sizeWidth - this.rebateBot.size);
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endX = m_x;
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }
                    this.offSet = m_x;

                } else if (pos == 2) {
                    m_x = this.offSet;
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x += _getEndPrepAngleOffset(this.endPrepAngle2, this.sizeWidth);
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    // rebate 1
                    if (this.rebateTop) {
                        m_startX = this.offSet;
                        m_startY = this.rebateTop.size;
                        m_endX = this.offSet + _getEndPrepAngleOffset(this.endPrepAngle2, this.rebateTop.size);
                        m_endY = this.rebateTop.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    // rebate 2
                    if (this.rebateBot) {
                        m_startX = this.offSet;
                        m_startY = this.sizeWidth - this.rebateBot.size;
                        m_endX = this.offSet + _getEndPrepAngleOffset(this.endPrepAngle2, this.sizeWidth - this.rebateBot.size);
                        m_endY = this.sizeWidth - this.rebateBot.size;
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }
                    this.offSet = m_x;
                }
                break;
        }
        return aStack;
    };


    this.edgeLines = function (aStack) {
        var m_startX = this.offSet;
        var m_startY = 0;
        var m_endX = this.offSet + this.lengthInternal;
        var m_endY = 0;


        // Rebate 1
        if (this.rebateTop) {
            m_startY = this.rebateTop.size;
            m_endY = this.rebateTop.size;

            // check for vNotches
            if (this.vNotches) {
                for (var m_i = 0; m_i < this.vNotches.length; m_i++) {
                    var m_item = this.vNotches[m_i];

                    if ((m_item.bottom == 0) && (this.rebateTop.size < m_item.vNotchDepth())) {
                        m_endX = m_item.xPos1();
                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                        m_startX = m_item.xPos2();
                    }
                }
            }
            m_endX = this.offSet + this.lengthInternal;
            aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
        }


        // Rebate 2
        if (this.rebateBot) {
            var m_rebateSize = this.sizeWidth - this.rebateBot.size;
            m_startY = m_rebateSize;
            m_startX = this.offSet;
            m_endY = m_rebateSize;

            // check for vNotches
            if (this.vNotches) {
                for (var m_i = 0; m_i < this.vNotches.length; m_i++) {
                    var m_item = this.vNotches[m_i];

                    if ((m_item.bottom !== 0) && (this.rebateBot.size < m_item.vNotchDepth())) {
                        m_endX = m_item.xPos1();

                        aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                        m_startX = m_item.xPos2();
                    }
                }
            }
            m_endX = this.offSet + this.lengthInternal;
            aStack.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateBot.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
        }

        this.offSet += this.lengthInternal;
        return aStack;
    };

    this.vNotchTop = function () {
        for (var m_i = 0; m_i < this.vNotches.length; m_i++) {
            var m_item = this.vNotches[m_i];
            var m_x = 0;
            var m_y = 0;
            var m_startX = 0;
            var m_startY = 0;
            var m_rebateSize = this.sizeWidth - this.rebateBot.size;

            if (m_item.bottom == 0) {
                // Top
                if (m_item.position > 0) {
                    m_x = m_item.xPos1();
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = m_item.position;
                    m_y = m_item.vNotchDepth();
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = m_item.xPos2();
                    m_y = 0;
                    this.myStackPath.push(new _line(m_x, m_y));

                    if (this.rebateTop.size < m_item.vNotchDepth()) {
                        // Top rebate
                        m_startX = m_item.xPos1();
                        m_endX = m_startX + this.rebateTop.size;
                        m_startY = this.rebateTop.size;
                        m_endY = m_startY;
                        this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                        m_startX = m_item.xPos2() - this.rebateTop.size;
                        m_endX = m_item.xPos2();
                        this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                    if (m_rebateSize < m_item.vNotchDepth()) {
                        // Bottom rebate
                        m_startX = m_item.xPos1();
                        m_endX = m_startX + this.rebateTop.size;
                        m_startY = m_rebateSize;
                        m_endY = m_startY;
                        this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                        m_startX = m_item.xPos2() - this.rebateTop.size;
                        m_endX = m_item.xPos2();
                        this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    }

                }
            }
        }
    };

    this.vNotchBot = function () {
        for (var m_i = 0; m_i < this.vNotches.length; m_i++) {
            var m_item = this.vNotches[m_i];
            var m_x = 0;
            var m_y = 0;
            var m_rebateSize = this.sizeWidth - this.rebateBot.size;


            if (m_item.bottom !== 0) {
                // Bottom
                if (m_item.position > 0) {
                    m_x = m_item.xPos2();
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = m_item.position;
                    m_y = this.sizeWidth - m_item.vNotchDepth();
                    this.myStackPath.push(new _line(m_x, m_y));

                    m_x = m_item.xPos1();
                    m_y = this.sizeWidth;
                    this.myStackPath.push(new _line(m_x, m_y));
                }
                if (this.rebateTop.size > (this.sizeWidth - m_item.vNotchDepth())) {
                    // Top rebate
                    m_startX = m_item.xPos1();
                    m_endX = m_startX + this.rebateTop.size;
                    m_startY = this.rebateTop.size;
                    m_endY = m_startY;
                    this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    m_startX = m_item.xPos2() - this.rebateTop.size;
                    m_endX = m_item.xPos2();
                    this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                }


                if (this.rebateBot.size < m_item.vNotchDepth()) {
                    // Bottom rebate
                    m_startX = m_item.xPos1();
                    m_endX = m_startX + this.rebateBot.size;
                    m_startY = m_rebateSize;
                    m_endY = m_startY;
                    this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                    m_startX = m_item.xPos2() - this.rebateTop.size;
                    m_endX = m_item.xPos2();
                    this.myStackEdge.push(new fenFrame.edge(m_startX, m_startY, m_endX, m_endY, this.rebateTop.facing ? { lineType: 'solid'} : { lineType: 'dotted' }));
                }

            }
        }
    };

    this.myStackEdge = new _stack();
    this.myStackPath = new _stack();

    // end Preps first
    this.myStackEdge = this.endPrep(this.myStackEdge, this.endPrepType1, 1);
    if (this.vNotches) { this.vNotchTop(); };
    this.myStackEdge = this.edgeLines(this.myStackEdge);
    this.myStackEdge = this.endPrep(this.myStackEdge, this.endPrepType2, 2);
    if (this.vNotches) { this.vNotchBot(); };

    //this.stack = myStackEdge;
};

fenFrame.svgWrapper = function (svgbody, width, height, options) {
    var m_result;
    var m_align = "xMidYMin";

    if (options) {
        if ((options.align == "centre") || (options.align == "center")) {
            m_align = "xMidYMin";
        } else if (options.align == "left") {
            m_align = "xMinYMin";
        } else if (options.align == "right") {
            m_align = "xMaxYMin";
        }
    }

    m_result = "<svg version=\"1.1\" ";
    m_result += "baseProfile=\"full\" ";
    m_result += "xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" ";
    m_result += "xmlns:ev=\"http://www.w3.org/2001/xml-events\" ";
    m_result += " viewBox=\"0,0, " + width + ", " + height + "\" ";
    m_result += " preserveAspectRatio=\"" + m_align + " meet\" ";
    m_result += ">";
    m_result += svgbody;
    m_result += "</svg>";

    return m_result;
};


// Public Properties/Methods
fenFrame.sectionPiece.prototype = {
    getSVG: function (options) {
		return fenFrame.svgWrapper(this.getSVGitem( ), this.lengthPeak, this.sizeWidth, options ); 
	},
	getSVGitem : function() {
	    var m_svg = "";
	    var m_item;
	    	    
	    if (this.myStackPath.stac.length) {
	    	m_item = this.myStackPath.pop();
		    
		    m_svg = "<path fill=\"" + this.fillColour + "\" ";
		    m_svg += "stroke=\"" + this.penColour + "\" ";
		    m_svg += "stroke-width=\"1\" "; 
		    m_svg += "stroke-linecap=\"square\" ";
		    m_svg += "d=\"M " + m_item.x + "," + m_item.y + " ";
		    
		    while (this.myStackPath.stac.length) {
		    	m_item = this.myStackPath.pop();
		    	
		    	m_svg += "L " + m_item.x + " ," + m_item.y + " ";
		    }
	        m_svg += "Z\" />";
	    }
	    
	    while (this.myStackEdge.stac.length){
	       m_item = this.myStackEdge.pop();      
	        
           m_svg += "<line x1=\"" + m_item.startX + "\" y1=\"" + m_item.startY + "\" " +
                "x2=\"" + m_item.endX + "\" y2=\"" + m_item.endY + "\" ";
		   m_svg += "stroke=\"" + this.penColour + "\" ";
		   m_svg += "stroke-width=\"1\" "; 
		   m_svg += "stroke-linecap=\"square\" ";
           
           if ( m_item.lineType == "dotted") {
        	   m_svg += " stroke-dasharray=\"2 2 2 2\" ";
           }
           m_svg += "  />"; 	        
	    }
	    return m_svg;
	},
	getOffSet : function(options) {
		return this.offSet;
	}
};


// Edge Class
fenFrame.edge = function( startX, startY, endX, endY, options) {
	// Private Properties/Methods
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	if (options) {
		this.lineType = options.lineType || "solid";
	};
};

// Public Properties/Methods
fenFrame.edge.prototype = {
			
};


// Rebate class
fenFrame.rebate = function( size, facing) {
    // Private Properties/Methods        
    this.size = size || 0;
    this.facing = facing == 1 ? true : false;
};

// Public Properties/Methods
fenFrame.rebate.prototype = {
    size : function() {
        return this.size;
    },
    facing : function () {
        return this.facing;
    }           
};

// V-notch class
fenFrame.vNotch = function( sizeWidth, position, bottom) {
	// Private Properties/Methods
	this.sizeWidth = sizeWidth || 0;
	this.bottom = bottom || 0;         // <> 0 is top
	this.position = position || 0;
};

//Public Properties/Methods
fenFrame.vNotch.prototype = {
	sizeWidth : function() {
		return this.sizeWidth;
	},
	bottom : function() {
		return this.bottom;
	},
	vNotchDepth : function() {
		return this.sizeWidth / 2;
	},
	position : function() {
		return this.position;
	},
	xPos1 : function() {
		return this.position - this.vNotchDepth();
	},
	xPos2 : function() {
		return this.position + this.vNotchDepth();
	}	

};

// Frame member class
fenFrame.frameMember = function(sectionPieces, options) {
    //Private Properties/Methods
    function _stack() {
        this.stac = new Array();
        this.pop = function () {
            return this.stac.pop();
        };
        this.push = function (item) {
            this.stac.push(item);
        };
    }

    function _line(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

	this.width = 0;
	this.height = 0;
	
	if (options) {
		this.reinforcingPiece = options.reinforcingPiece;		// use sectionPiece class
	};
	this.offSet = 0;	
	this.mySectionStack = new _stack();
	this.myReinforcingStack = new _stack();
	
	for (var m_i = 0; m_i < sectionPieces.length; ++m_i) {
		// TODO - validate, check that pieces will fit together
	    this.mySectionStack.push(sectionPieces[m_i]);	    
	}
	
    // Add reinforcing
    if ( this.reinforcingPiece ) {
    	// Currently only one piece of reinforcing is passed
    	this.myReinforcingStack.push(this.reinforcingPiece);
    }

	
};

//Public Properties/Methods
fenFrame.frameMember.prototype = {
	getSVG : function() {
		return fenFrame.svgWrapper(this.getSVGitem(), this.width, this.height );
	},
	getSVGitem : function() {
    var m_svg = "";
    var m_item;
    var m_offSet = 0;
    var m_offSetReinforcingX = 0;
    var m_offSetReinforcingY = 0;
    
	while( this.mySectionStack.stac.length ) {
    	m_item = this.mySectionStack.pop();
    	
    	//for each path
    	for(var m_i = 0; m_i < m_item.myStackPath.stac.length; m_i++) {
    		m_item.myStackPath.stac[m_i].x += m_offSet;
    	}
    	
    	//for each edge
    	for(var m_i = 0; m_i < m_item.myStackEdge.stac.length; m_i++) {
    		m_item.myStackEdge.stac[m_i].startX += m_offSet;
    		m_item.myStackEdge.stac[m_i].endX += m_offSet;
    	}
    	this.width += m_item.lengthPeak;
    	this.height = ( m_item.sizeWidth > this.height ) ? m_item.sizeWidth : this.height; 
    	
    	m_offSet += m_item.offSet;
    	m_svg += m_item.getSVGitem();
	}
	
	while( this.myReinforcingStack.stac.length ) {
		m_item = this.myReinforcingStack.pop();
		
		if ( m_item ) {
			// centre the piece
			m_offSetReinforcingX = (this.width - m_item.lengthPeak) / 2;
			m_offSetReinforcingY = (this.height / 2) - (m_item.sizeWidth / 2);

			//for each path
	    	for(var m_i = 0; m_i < m_item.myStackPath.stac.length; m_i++) {
	    		m_item.myStackPath.stac[m_i].x += m_offSetReinforcingX;
	    		m_item.myStackPath.stac[m_i].y += m_offSetReinforcingY;
	    	}

	    	//for each edge
	    	for(var m_i = 0; m_i < m_item.myStackEdge.stac.length; m_i++) {
	    		m_item.myStackEdge.stac[m_i].startX += m_offSetReinforcingX;
	    		m_item.myStackEdge.stac[m_i].endX += m_offSetReinforcingX;
	    		m_item.myStackEdge.stac[m_i].startY += m_offSetReinforcingY;
	    	}
	    	
			m_svg += m_item.getSVGitem();
		}
	}	
    return m_svg;
	}
};


fenFrame.evolutionFillColour = {
    // Override this for your own colour mapping
    // Returns hex number used for background fill colour
    WHITE: '#ffffff',
    MAHOGANY: '#80400',         // RGB : 128 64 0
    OAK: '#ff8040',             // RGB : 255 128 64
    ROSEWOOD: '#800000',        // RGB : 128 0 0
    CREAM: '#F2EF6F',           // RGB : 242 239 111
    BLACK: '#000000',           // RGB : 0 0 0
    GREEN: '#008000',           // RGB : 0 128 0
    BLUE: '#000080',            // RGB : 0 0 128
    RED: '#FF0000'              // RGB : 255 0 0
};

fenFrame.evolutionPenColour = {
    // Override this for your own colour mapping
    // Returns colour for lines based on background colour
    // BACKGROUND COLOUR: 'pen colour in hex'
    WHITE: '#000000',
    MAHOGANY: '#000000',         
    OAK: '#000000',             
    ROSEWOOD: '#000000',        
    CREAM: '#000000',           
    BLACK: '#ffffff',           
    GREEN: '#000000',           
    BLUE: '#000000',            
    RED: '#F000000'              
};

fenFrame.evolutionVNotch = function (depth, position, otherSide) {
    // Joint type of 1 = VNotch
    this.depth = depth || 67;
    this.bottom = 0;
    if (( otherSide == "True" ) || ( otherSide == "TRUE" ) || ( otherSide == "1" ) ) {
        this.bottom = 1;
    } else if (( otherSide == "False" ) || ( otherSide == "FALSE" ) || ( otherSide == "0" ) ) {
        this.bottom = 0;
    }
    this.position = position || 0;

    return new fenFrame.vNotch( this.depth, this.position, this.bottom);
};


fenFrame.evolutionSectionPiece = function (endPrepID1,
                                            endPrepID2,
                                            lengthInternal,
                                            lengthPeak,
                                            machinePrepReversed,
                                            rebateFacing,
                                            width,
                                            shape,
                                            colourDescription,
                                            rebateDepth,
                                            vNotches,
                                            options) {
    _evolutionFillColour = function (evoColour) {
        var m_colour = evoColour || "";

        m_colour = m_colour.split(" ")[0].toUpperCase();
        return fenFrame.evolutionFillColour[m_colour] || "#ffffff";
    };

    _evolutionPenColour = function (evoColour) {
        var m_colour = evoColour || "";

        m_colour = m_colour.split(" ")[0].toUpperCase();
        return fenFrame.evolutionPenColour[m_colour] || "#000000";
    };

    _evolutionEndPrepMap = function (endPrepType) {
        switch (endPrepType) {
            case 1: // Mitre
                return 2;
                break;
            case 2: // Square
            case 6: // Milled
                return 1;
                break;
            case 3: // Rev Mitre
                return 3;
                break;
            case 7: // Butt V Top 
                return 4;
                break;
            case 8: // Butt V Bottom 
                return 5;
                break;
            case 4: // Angle
                return 6
                break;
            case 5: // Opp mitre            -- Not yet implemented
            case 9: // Butt V top & Bottom  -- Not yet implemented
            case 10: // Rev Mitre Angled    -- Not yet implemented
                throw "Not yet implemented";
                break;
            default:
                throw "Not yet implemented";
        }
    };

    // TODO - clean this shit up
    if (typeof lengthInternal == "undefined") { throw "Missing length internal"; } else { lengthInternal = Number(lengthInternal); };
    if (typeof lengthPeak == "undefined") { throw "Missing length peak"; } else { lengthPeak = Number(lengthPeak); };
    if (typeof machinePrepReversed == "undefined") {
        throw "Missing saw reversed";
    } else {
        machinePrepReversed == "True" ? machinePrepReversed = 1 : machinePrepReversed = 0;
    }

    if (typeof rebateFacing == "undefined") {
        throw "Missing rebateFacing";
    } else {
        rebateFacing == "0" ? rebateFacing = 1 : rebateFacing = 0;
    }
    if (typeof width == "undefined") { throw "Missing width"; } else { width = Number(width); };

    var m_lengthInternal = lengthInternal;
    var m_lengthPeak = lengthPeak;
    var m_machinePrepReversed = machinePrepReversed;
    var m_rebateFacing = rebateFacing;
    var m_width = width < 149 ? width : 30;
    var m_tmp;
    var m_shape = shape || "";
    var m_rebateDepth = rebateDepth ? Number(rebateDepth) : 20;
    var m_options = {};

    m_options.fillColour = _evolutionFillColour(colourDescription);
    m_options.penColour = _evolutionPenColour(colourDescription);
    m_options.apertureX = options.apertureX || 0;
    m_options.apertureY = options.apertureY || 0;
    m_options.component = options.componentSpecific || "";
    m_options.endPrepAbbreviation1 = options.endPrepAbbreviation1 || "";
    m_options.endPrepAbbreviation2 = options.endPrepAbbreviation2 || "";
    m_options.StartX = options.positionStartX || 0;
    m_options.StartY = options.positionStartY || 0;
    m_options.EndX = options.positionEndX || 0;
    m_options.EndY = options.positionEndY || 0;
    m_options.stockCode = options.stockCode || "";
    m_options.stockDescription = options.stockDescription || "";
    m_options.weight = options.weight || 0;

    switch (m_shape) {
        case "L":
            m_options.rebateTop = new fenFrame.rebate(m_rebateDepth, m_rebateFacing);
            break;
        case "T":
            m_options.rebateTop = new fenFrame.rebate(m_rebateDepth, m_rebateFacing); ;
            m_options.rebateBot = new fenFrame.rebate(m_rebateDepth, m_rebateFacing); ;
            break;
        case "Z":
            m_options.rebateTop = new fenFrame.rebate(m_rebateDepth, m_rebateFacing); ;
            m_options.rebateBot = new fenFrame.rebate(m_rebateDepth, m_rebateFacing ? 0 : 1);
            break;
    }

    // End Preps
    if (m_rebateFacing == 0) {
        // flip end preps if rebate faces away.
        m_tmp = endPrepID2;
        endPrepID2 = endPrepID1;
        endPrepID1 = m_tmp;
    }

    endPrepID1 = Number(endPrepID1);
    m_endPrepID1 = _evolutionEndPrepMap(endPrepID1);

    endPrepID2 = Number(endPrepID2);
    m_endPrepID2 = _evolutionEndPrepMap(endPrepID2);

    if (vNotches) {
        if (m_rebateFacing == 0) {
            // We need to flip the prep position.
            for (var m_i = 0; m_i < vNotches.length; m_i++) {
                vNotches[m_i].position = m_lengthPeak - vNotches[m_i].position;
            }
        }

        if (m_machinePrepReversed == 1) {
            for (var m_i = 0; m_i < vNotches.length; m_i++) {
                vNotches[m_i].position = m_lengthPeak - vNotches[m_i].position;
            }
        }

        m_options.vNotches = vNotches;
    }
    return new fenFrame.sectionPiece(m_lengthInternal, m_width, m_endPrepID1, m_endPrepID2, m_options);
};

fenFrame.evolutionFrameMembers = function (sectionPieces) {
    // Expects an array of sections pieces
    if (!(sectionPieces)) {
        return;
    }

    // Sort by Component Specific
    for (var m_i = 0; m_i < sectionPieces.length; m_i++) {
        
    }

};

