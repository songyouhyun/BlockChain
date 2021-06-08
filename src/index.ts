import * as CryptoJS from "crypto-js";
class Block {

    // Block 클래스 안에서 항상 사용 가능한 함수
    // 원래 Block클래스 안에서 함수를 만들게되면 블록을 생성했을때만 사용이 가능하다.
    // 하지만 static으로 정적 함수로 지정을 해줌으로써 블록을 생성하지 않아도 사용가능한 함수로 만든다.
    // 즉, 클래스가 생성되지 않아도 호출할 수 있는 함수이다. (굳이 Block함수 안에 없어도 됨)
    static calculateBlockHash = (
        index: number,
        previousHash: string,
        data: string,
        timestamp: number
        ): string => CryptoJS.SHA256(index + previousHash + data + timestamp).toString();

    static validateStructure = (aBlock: Block) : boolean =>   // 리턴값은 boolean인 이유는, 블록의 구조가 유효한지 아닌지 판단하기 위해서(구조가 맞으면 True, 틀리면 False)
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        aBlock.data === "string";

    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp
    }
}

const genesisBlock: Block = new Block(0, "answlgP", "", "HelloWorld",213985);

let blockchain: Block[] = [genesisBlock];

// 내 블록체인이 얼마나 긴지 알아야 함, 그래야지 내 블록체인이 블록을 하나 더 추가할 수가 있기 때문
const getBlockchain = () : Block[] => blockchain;

// 내 블록체인의 길이를 알기 위한 변수
// 가장 최근의 블록체인을 가져옴
const getLatestBlock = () : Block => blockchain[blockchain.length - 1];

// 블록체인의 시간을 가져옴
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

// 새 블록체인 생성
const createNewBlock = (data:string) : Block => {
    const previousBlock : Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        data,
        newTimestamp
        );
        const newBlock : Block = new Block(
        newIndex,
        newHash,
        previousBlock.hash,
        data,
        newTimestamp
        );
        return newBlock;
};

// 제공되고 있는 블록이 유효한지 아닌지 판단하는 함수
const isBlockValid = (candiateBlock : Block, previousBlock: Block) : boolean => {
    // 블록의 구조가 유효한지 체크
    // candidate블록, previous블록을 받고 유효하지 않으면 False를 return
    if(!Block.validateStructure(candiateBlock)){
        return false;
    } else if(previousBlock.index + 1 !== candiateBlock.index){
        return false;
    } else if(previousBlock.hash !== candiateBlock.previousHash){
        return false;
    }
    return true;
};