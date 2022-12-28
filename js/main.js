

// document.querySelector('button').addEventListener('click', getFetch)

function getFetch() {
    let inputVal = document.getElementById('barcode').value
    if(inputVal.length != 12){
        alert(`Please ensure that barcode is 12 characters`)
        return; //This is an empty return to kick us out of the function
    }
    let URL = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

    fetch(URL)
        .then(res => res.json())//parse response as JSON
        .then(data => {
            console.log(data)
            if(data.status === 1){
                //call some stuff
                const item = new ProductInfo(data.product) //we call the class and make a new item so that it can do everything and we can learn to use oop. the data.product is from the api where everything is held.
                item.showInfo()
                item.listIngredients()
            }
            else if(data.status === 0){
                alert(`Product ${inputVal} not found, please try another item!`)
            }
            //call additional stuff if product is found, else, let the user know that the product is not in the database
        })
        .catch(err => {
            console.log(`error: ${err}`)
        })
}

class ProductInfo {
    constructor(productData){ //I am passing in data.product
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
    }

    showInfo(){
        document.getElementById('product-name').innerText = `${this.name}`
        document.getElementById('product-img').src = `${this.image}`  
    }

    listIngredients() {
        let tableRef = document.getElementById('ingredient-table')
        for(let i = 1; i < tableRef.rows.length;) {//skip the first row and loop through all the rows
            tableRef.deleteRow(i)//loop through the table and delete the row below the header until its clear
        }

        if(!(this.ingredients == null)) {
            //this if statement lets us check first if the json response has a list of ingredients.
        //for in is a for loop specific to objects without you knowing exactly how many items are in the object
            for(let key in this.ingredients){
                let newRow = tableRef.insertRow(-1)//this makes a new row under the head of the table
                let newIcell = newRow.insertCell(0)//makes a new ingredient cell in the left of the table
                let newVcell = newRow.insertCell(1)//makes a new vegetarian cell in the right of the table
                let newIText = document.createTextNode(this.ingredients[key].text)
                let vegStatus = this.ingredients[key].vegetarian == null ? 'unkown' : this.ingredients[key].vegetarian
                //above, we use a ternary to test if the ingredient from the objeck is falsy by using double equals, ex:undefined, null, then ternary it into just saying 'unknown' and if its not, then just return the response from the json
                let newVText = document.createTextNode(vegStatus)
                newIcell.appendChild(newIText)
                newVcell.appendChild(newVText)
                if (vegStatus === 'no') {
                    //turn item red in the table
                    newVcell.classList.add('non-veg-item')
                }else if(vegStatus === 'unkown' || vegStatus === 'maybe') {
                    newVcell.classList.add('unknown-maybe-item')
                    //turn item yellow in the table
                }

            }
        }

    }


}
