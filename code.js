figma.showUI(__html__, { width: 1080, height: 405 })


function setTextStylesWithHeadingSpecs(headingSpecs, textStyles, folderName){

  for(let i = 0 ; i < headingSpecs.length; i ++){
        let textStyle = figma.createTextStyle();
        textStyle.fontSize = headingSpecs[i].sizePx;
        textStyle.lineHeight =  {value: headingSpecs[i].heightPx, unit: "PIXELS"};
        
        var headingVal = ''
        if(headingSpecs[i].heading > 0){
            headingVal = `h${Math.abs(headingSpecs[i].heading - 5)}`;
        }
        if (headingSpecs[i].heading == 0){
            headingVal = "paragraph"
        } else if (headingSpecs[i].heading < 0) {
            headingVal = "caption"
        }
        if(folderName === ""){
            folderName = "Roboto"
        }
        textStyle.name = `${folderName} / ${headingVal}: ${headingSpecs[i].sizePx.toFixed(2)}px`;
        textStyles.push(textStyle.id)
    }
    return textStyles.reverse()
}

function setTextStyles(text, i, count, folderName){
    let textStyle = figma.createTextStyle();
    textStyle.fontSize = text.fontSize;
    textStyle.lineHeight = text.lineHeight;

    let headingVal = Math.abs(i-(count + 2));
    if(headingVal <= count){
        headingVal = `h${headingVal}`
    } else if (headingVal == count + 1){
        headingVal = "paragraph"
    } else {
        headingVal = "caption"
    }

    if(!folderName){
        folderName = "Roboto"
    } 
    textStyle.name = `${folderName} / ${headingVal}: ${text.fontSize.toFixed(2)}px `
    text.textStyleId = textStyle.id
}

function createMarkup(markdown, frame, leading, margin){
    const leadingInstance = leading.createInstance();
    frame.appendChild(leadingInstance)
    leadingInstance.layoutAlign = "STRETCH"
}

function buildContainerFrame(width, height){
    const frame = figma.createFrame();
    frame.resize(width, 300); 
    figma.currentPage.appendChild(frame);
    frame.layoutMode = "VERTICAL";
    frame.counterAxisSizingMode = "AUTO";
    frame.fills = [];
    return frame;
}

function buildLeading(width, lineHeight){
    const leading = figma.createComponent()
    leading.fills = [{type: 'SOLID', opacity: 0.3, color: {r: (146/255), g: (211/255), b: (238/255)}}]
    leading.layoutAlign = "STRETCH";
    leading.resize(width, lineHeight); 
    leading.y = -55;
    leading.x = -550
    leading.name = "margins"
    return leading;
}

function buildMarkdown(frame, markdown, textStylesSelected, headingSpecs, margins, leading, textStyles){
    const reversedHeadingSpecs = headingSpecs.reverse()
    let markdownRegexp = /(\n+(?<ATXLayer>#*)\s*(?<ATXName>.+))/g;
    let ATXResults = markdown.matchAll(markdownRegexp);
    if(margins){
        margins = margins.reverse()
    }
    var previousMargin = false;

     for(let ATXResult of ATXResults) {
        let {ATXLayer, ATXName} = ATXResult.groups;
        let heading = ATXLayer.length - 1

            if (heading < 0){
                heading = 4
            }
        
        if(margins){
            let marginCount = margins[heading][0]
            if (previousMargin){
                marginCount = marginCount-1

            }
            for(let i = 0; i < marginCount; i++){
                const leadingInstance = leading.createInstance();
                frame.appendChild(leadingInstance)
                leadingInstance.layoutAlign = "STRETCH"
            }    
        } else {
            const leadingInstance = leading.createInstance();
            frame.appendChild(leadingInstance)
            leadingInstance.layoutAlign = "STRETCH" 
        }

        const text = figma.createText();
        text.layoutAlign = "STRETCH"
        text.characters = ATXName;

        if(textStyles.length > 0){  
            text.textStyleId = textStyles[heading];
        } else {
            text.fontSize = reversedHeadingSpecs[heading].sizePx;
            text.lineHeight =  {value: reversedHeadingSpecs[heading].heightPx, unit: "PIXELS"};
        }
        frame.appendChild(text);

        //bottom margin
        if(margins){
            let marginCountBottom = margins[heading][1]
            for(let i = 0; i < marginCountBottom; i++){
                const leadingInstance = leading.createInstance();
                frame.appendChild(leadingInstance)
                leadingInstance.layoutAlign = "STRETCH"
            } 
            previousMargin = true;
        } 
    } 

        
}

function setGrid(frame, lineHeight) {
    frame.layoutGrids = frame.layoutGrids.concat([{
        color: {a:0.3, r: (146/255), g: (211/255),   b: (238/255)},
        pattern: "ROWS", 
        alignment: "MIN",
        gutterSize: ((lineHeight/2) - 1),
        count: Infinity,
        sectionSize: 1,
        offset: 0,
        }])
}        

function createHeadings(frame, textStylesSelected, headingSpecs, margins, leading, textStyles){
    var previousMargin = false;
    const reversedHeadingSpecs = headingSpecs

    const nodes = [];

    for(let heading = 0; heading < headingSpecs.length; heading ++){
        if(margins){
            let marginCount = margins[heading][0]
            if (previousMargin){
                marginCount = marginCount-1
            }
            for(let i = 0; i < marginCount; i++){
                const leadingInstance = leading.createInstance();
                frame.appendChild(leadingInstance)
                leadingInstance.layoutAlign = "STRETCH"
            }    
        } else {
            const leadingInstance = leading.createInstance();
            frame.appendChild(leadingInstance)
            leadingInstance.layoutAlign = "STRETCH" 
        }
        const text = figma.createText();
            text.layoutAlign = "STRETCH"
            text.characters = "Lorem Ipsum"

        if(textStyles.length > 0){  
            text.textStyleId = textStyles[heading];
        } else {
            text.fontSize = reversedHeadingSpecs[heading].sizePx;
            text.lineHeight =  {value: reversedHeadingSpecs[heading].heightPx, unit: "PIXELS"};
        }
        

        const headingRow = figma.createFrame();
            headingRow.layoutMode = "HORIZONTAL";
            headingRow.primaryAxisSizingMode = "AUTO";
            headingRow.counterAxisSizingMode = "AUTO";
            headingRow.fills = [];
            headingRow.clipsContent = false;
            
            const heightVal = figma.createText();
            const fontSizeVal = figma.createText();

            heightVal.characters = reversedHeadingSpecs[heading].heightPx + "px";
            heightVal.lineHeight = {value: reversedHeadingSpecs[heading].heightPx, unit: "PIXELS"};
            fontSizeVal.characters = reversedHeadingSpecs[heading].sizePx.toFixed(2) + "px";
            fontSizeVal.lineHeight = {value: reversedHeadingSpecs[heading].heightPx, unit: "PIXELS"};
            
            text.layoutAlign = "INHERIT"

            headingRow.appendChild(fontSizeVal);
            headingRow.appendChild(heightVal);
            headingRow.appendChild(text);            
            headingRow.counterAxisAlignItems = "CENTER";
            headingRow.itemSpacing = 16;
            headingRow.primaryAxisSizingMode = "AUTO";
            headingRow.counterAxisSizingMode = "AUTO";
            
            [headingRow.paddingLeft, 
                headingRow.paddingRight,
                headingRow.paddingBottom,
                headingRow.paddingTop] =
                [0,0,0,0]
            frame.appendChild(headingRow); 
            nodes.push(text);
            nodes.push(fontSizeVal);
            nodes.push(heightVal)
        if(margins){
            let marginCountBottom = margins[heading][1]
            for(let i = 0; i < marginCountBottom; i++){
                const leadingInstance = leading.createInstance();
                frame.appendChild(leadingInstance)
                leadingInstance.layoutAlign = "STRETCH"
            } 
            previousMargin = true;
        } 
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.viewport.zoom = 0.5
}

figma.ui.onmessage = async msg => {
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
    if (msg.type === 'create-rectangles') {

        const frame = buildContainerFrame(msg.width, 300);
        const headingFrame = buildContainerFrame(msg.width, 300);
        const leading = buildLeading(msg.width, msg.lineHeight.value)
        var textStyles = []

        frame.name = "Markdown"

        headingFrame.name = "Headings"
        headingFrame.x = -550
        headingFrame.counterAxisSizingMode = "FIXED";
        
        if(msg.textStylesSelected){
            textStyles = setTextStylesWithHeadingSpecs(msg.headingSpecs, textStyles, msg.folderName)
        }

        if(msg.markdown){
            buildMarkdown(frame, msg.markdown, msg.textStylesSelected, msg.headingSpecs, msg.margins, leading, textStyles)
        }
        
        if(msg.gridToggle){
            setGrid(frame, msg.lineHeight.value)
            setGrid(headingFrame, msg.lineHeight.value)
        }

        if(msg.headingsToggle){
            createHeadings(headingFrame, msg.textStylesSelected, msg.headingSpecs, msg.margins, leading, textStyles)
        }
    }
    figma.closePlugin();
};