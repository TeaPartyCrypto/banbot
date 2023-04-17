function detectNames(list1, list2) {
    let detectedNames = false ;
  
    for (let i = 0; i < list2.length; i++) {
      let name = list2[i].toLowerCase();
      let match = list1.find(item => item.toLowerCase() === name);
      if (match) {
        detectedNames = true
      }
    }
    return detectedNames;
  }
module.exports = detectNames