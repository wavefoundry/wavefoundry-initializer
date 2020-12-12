const pathNode = require(`path`);
const admin = require("firebase-admin");
const crypto = require(`crypto`);
const { createRemoteFileNode } = require("gatsby-source-filesystem");
let serviceAccount;
try {
  serviceAccount = require("./serviceAccount.json");
} catch {
  serviceAccount = {
    type: "service_account",
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, "\n"),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  };
}
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const createContentDigest = obj =>
  crypto.createHash(`md5`).update(JSON.stringify(obj)).digest(`hex`);

const CONTENT = "content";
exports.sourceNodes = async ({ actions: { createNode } }) => {
  const productDocs = await db.collection("products").get();
  productDocs.forEach(doc => {
    const product = doc.data();
    const id = doc.id;
    if (product.archived === false) {
      const priceOptionArray = Object.keys(product.priceOptions)
        .map(key => {
          return {
            key,
            price: product.priceOptions[key].price,
          };
        })
        .sort((a, b) => (a.price > b.price ? 1 : -1));
      createNode({
        id,
        ...product,
        priceOptionArray,
        internal: {
          type: "Product",
          content: JSON.stringify(product),
          contentDigest: createContentDigest(product),
        },
      });
    }
  });
  const contentDoc = await db.collection(CONTENT).doc(CONTENT).get();
  if (contentDoc.exists) {
    const contentData = contentDoc.data();
    createNode({
      id: CONTENT,
      ...contentData,
      internal: {
        type: "Content",
        content: JSON.stringify(contentData),
        contentDigest: createContentDigest(contentData),
      },
    });
  }
  return;
};
exports.onCreateNode = async ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  if (node.internal.type === "Product") {
    const nodeData = {
      url: node.image.imageURL,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      cache,
      store,
    };
    const image = await createRemoteFileNode(nodeData);
    if (image) {
      node.productImage___NODE = image.id;
    }
  }
  if (node.internal.type === "Content") {
    for (const key in node) {
      if (
        node[key] &&
        typeof node[key] === "object" &&
        node[key].hasOwnProperty("imageURL")
      ) {
        const nodeData = {
          url: node[key].imageURL,
          parentNodeId: node.id,
          createNode,
          createNodeId,
          cache,
          store,
        };
        const contentImage = await createRemoteFileNode(nodeData);
        if (contentImage) {
          node[key].contentImage___NODE = contentImage.id;
        }
      }
    }
  }
};

exports.onCreatePage = async ({ page, actions: { createPage } }) => {
  if (page.path.match(/^\/checkout/)) {
    page.matchPath = "/checkout/*";
    createPage(page);
  }
};
