

const cleanupBreakLine = (data: any) => {
  const cleanedData: any = data.replace(/(\r\n|\n|\r)/gm, "");
  return cleanedData;
}
const cleanupBreakLineArray = (data: any) => {
    const cleanedData: any = data.map((element: any) => {
        const cleanedElement: any = cleanupBreakLine(element);
        return cleanedElement;
    });
    return cleanedData;
}

const startArrayFromData = (data: any) => {
    const cleanedArray: any = [];
    const startSignRequired: any = "<"; 
    const pauseSignRequired: any = ">";
    const endSignRequired: any = "/>";
    const signFound: boolean = data.includes(startSignRequired);
    const pauseSignFound: boolean = data.includes(pauseSignRequired);
    const endSignFound: boolean = data.includes(endSignRequired);
    // console.log("signFound:", signFound);

    if(startSignRequired){
        // cleanedArray.push()
        console.log(data);
        
    }

    // while (signFound) {
    //     while (pauseSignFound) {
    //         while (endSignFound) {
    //             console.log("endSignFound with pause:", endSignFound);
    //         }
    //     }
    //     while (endSignFound) {
    //         console.log("endSignFound without pause:", endSignFound);
    //     }
    // }


    // data.forEach((element: any) => {
    //     element.split("<").forEach((word: any) => {
    //         cleanedArray.push(word);
    //     });
    // });

    return data;
}


export {cleanupBreakLine, cleanupBreakLineArray, startArrayFromData};


// export default cleanupBreakLine;