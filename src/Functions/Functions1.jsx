export function filterItem(bools, bools2){
    let result = true
    Object.keys(bools).forEach(title => {
      let res = filterObject(bools[title], bools2[title])
      if( res == false) result = false
    })
    return result
  }
export function filterObject(options, options2){
    let result = true
    Object.keys(options).forEach(key => {
      if(options[key] == true && options2[key] == false){
        result = false
      }
    })
    return result
  }
export function quantityBool(options, options2){
    let result = true
    if(options.minPrice > options2.price || options.maxPrice < options2.price) result = false
    if(options.rating > options2.rating) result = false
    return result
  }
  
export function compareByMaxPrice(a, b) {
    return b.filters.quantities.price - a.filters.quantities.price;
  }
export function compareByPrice(a, b) {
    return a.filters.quantities.price - b.filters.quantities.price;
  }
export function compareByRating(a, b) {
    return b.filters.quantities.rating - a.filters.quantities.rating;
  }