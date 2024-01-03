import { useState } from 'react';
import './App.css';

/**
 * FilterableProductTableコンポーネント
 * 
 * フィルタリングできる商品テーブルを表示する全体のコンポーネント
 */
function FilterableProductTable({ products }){
  const [filterText, setFilterText] = useState('');// ユーザが入力したテキストを管理
  const [inStockOnly, setInStockOnly] = useState(false);// 在庫のみ表示のチェックボックスの状態を管理

  return (
    <div>
      <SearchBar 
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  )
}

/**
 * SearchBarコンポーネント
 * 
 * 検索バーと在庫のみ表示チェックボックスを含むフォーム
 */
function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) {
  return (
    <form>
      <input
        type='text'
        value={filterText}
        placeholder='Search...'
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type='checkbox'
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {'  '}
        Only show products in stock
      </label>
    </form>
  )
}

/**
 * ProductsTableコンポーネント
 * 
 * 商品データを表示するテーブル
 */
function ProductTable({ products, filterText, inStockOnly }){
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    // テキストフィルタに合致しない商品はスキップ
    if(
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ){
      return;
    }
    // 在庫のみ表示チェックが付いていて、在庫がない商品はスキップ
    if(inStockOnly && !product.stocked) {
      return;
    }
    // 商品カテゴリの変更時にカテゴリ行を挿入
    if(product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      )
    }
    // 商品行を挿入
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

/**
 * ProductCategoryRowコンポーネント
 * 
 * 商品テーブル内での商品カテゴリの行
 */
function ProductCategoryRow({ category }){
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

/**
 * ProductRowコンポーネント
 * 
 * 商品テーブル内での商品行
 */
function ProductRow({ product }){
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;
  
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

/**
 * PRODUCTSデータ
 * 
 * サンプル商品データの配列
 */
const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
]

/**
 * Appコンポーネント
 * 
 * アプリケーションのメインコンポーネント、one-way data flowを採用
 */
export default function App() {
  return <FilterableProductTable products={PRODUCTS}/>;
}