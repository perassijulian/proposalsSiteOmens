import { useEffect, useMemo, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { UnsupportedChainIdError } from "@web3-react/core";
// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
import { ethers } from "ethers";
import ProposalRender from './components/ProposalRender';
import Treasury from "./components/Treasury";
import AddProposalForm from "./components/AddProposalForm";
import ActiveProposals from "./components/ActiveProposals";
import Tabs from "./components/Tabs";
import MemberList from "./components/MemberList";
import Navbar from "./components/Navbar";
import About from "./components/About";
import "./styles/App.scss";

// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x5d121cfd8cac3CcA9266250556440399CEcBdbca",
);
const tokenModule = sdk.getTokenModule(
  "0x6FE86cE382861A8860B9121ed0861Bcfc524b5F0"
);
const voteModule = sdk.getVoteModule(
  "0x372f82efA25f7537E73d43296db6Bd32FD3D7027",
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  // VARIABLES TO RENDER PROPOSALS
  const [proposalsAlreadyVoted, setProposalsAlreadyVoted] = useState([]);
  const [proposalsToVote, setProposalsToVote] = useState([]);
  //VARIABLE TO ALLOW VOTING
  const [accountBalance, setAccountBalance] = useState(0);
  //VARIABLE TO RENDER NAVBAR
  const [toRender, setToRender] = useState(<About />);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // A simple call to voteModule.getAll() to grab the proposals.
    voteModule
      .getAll()
      .then((proposals) => {
        // Set state!
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals)
      })
      .catch((err) => {
        console.error("failed to get proposals", err);
      });
  }, [hasClaimedNFT]);

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    // Check if the user has already voted on the first proposal.
    for (let i = 0; i < proposals.length; i++) { 
      voteModule
        .hasVoted(proposals[i].proposalId, address)
        .then((hasVoted) => {
          if (!hasVoted) {
            setProposalsToVote(prevState => [...prevState, proposals[i]]);
          } else {
            setProposalsAlreadyVoted(prevState => [...prevState, proposals[i]]);
          }
        })
        .catch((err) => {
          console.error("failed to check if wallet has voted", err);
        });
    }
  }, [hasClaimedNFT, proposals, address]);

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    
    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses)
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  }, [hasClaimedNFT]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        setMemberTokenAmounts(amounts)
        console.log("👜 Amounts", amounts)
        try {
          setAccountBalance(
          ethers.utils.formatUnits(amounts[address].toString(),18)
        )} catch (e) {
          console.log(e)
        }
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  // Another useEffect!
  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  if (error instanceof UnsupportedChainIdError ) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet and REFRESH the site.
        </p>
      </div>
    );
  }

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Omens</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }
  
  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
    .claim("0", 1)
    .then(() => {
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    })
    .catch((err) => {
      console.error("failed to claim", err);
    })
    .finally(() => {
      // Stop loading state.
      setIsClaiming(false);
    });
  }

  const TabAbout = <About />

  const TabProposals =
  <div className="tabs--proposals">
    <div>
      <p>Active Proposals</p>
      <ActiveProposals 
        proposalsToVote={proposalsToVote}
        tokenModule={tokenModule}
        voteModule={voteModule}
        address={address}
        accountBalance={accountBalance}
        hasVoted={hasVoted}
        setHasVoted={setHasVoted}
      />
    </div>
    <div>
      <p>Proposals already voted</p>
      <ProposalRender 
        key={proposalsAlreadyVoted.proposalId}
        proposalToRender={proposalsAlreadyVoted} 
        ableToVote={false}
      />
    </div>
  </div>

  const TabSubmitProject = 
  <div>
    <AddProposalForm 
      tokenModule={tokenModule}
      voteModule={voteModule}
      proposalsLength={proposals.length}
    />
  </div>
  
  const TabTreasury = 
  <div className="tab--treasury">
    <Treasury 
      proposals={proposals}
      voteModule={voteModule}
    />

    <MemberList 
      memberList={memberList}
    />
  </div>


  if (hasClaimedNFT) {
    return (
      <div className="container">
        <Navbar 
          About={TabAbout}
          Proposals={TabProposals}
          Project={TabSubmitProject}
          Treasury={TabTreasury}
          setToRender={setToRender}
        />          
        <div className="dashboard">  
          {toRender}
        </div>
      </div>
    );
  };

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your NFT to access Omens</h1>
      <button
        disabled={isClaiming}
        onClick={() => {
          setIsClaiming(true);
          // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
          bundleDropModule
            .claim('0', 1)
            .then(() => {
              setHasClaimedNFT(true);
              alert(
                `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
              );
            })
            .catch((err) => {
              console.error('failed to claim', err);
              setIsClaiming(false);
              setHasClaimedNFT(false);
            })
            .finally(() => {
              // Stop loading state.
              setIsClaiming(false);
            });
        }}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;