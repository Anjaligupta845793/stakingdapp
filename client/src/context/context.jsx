// MyContext.js
import { createContext, useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { stakabi, stakAddres } from "../ABI/staking";
import { stakTokenAdd, stakToken } from "../ABI/staktoken";
import { rewardABI, rewardAddress } from "../ABI/reward";
import toast from "react-hot-toast";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [rewards, setrewards] = useState(null);
  const [stakedAmount, setStakedAmount] = useState(null);
  const [rewardRate, setrewardRate] = useState(null);
  const [stakeContract, setstakeContract] = useState([]);
  const [approveAmount, setapproveAmount] = useState("");
  const [stakingContract, setstakingContract] = useState([]);
  const [userStakInput, setuserStakInput] = useState("");
  const [withdrawInput, setwithdrawInput] = useState("");

  const [state, setState] = useState({
    provider: null,
    account: null,
    balance: null,
    chainId: null,
    isConnected: false,
  });

  const displayHandler = async (Factory, address) => {
    const rewardRate = await Factory.REWARD_RATE();
    const decimals = 18;
    const formattedRate = ethers.formatUnits(rewardRate, decimals);
    console.log("Reward Rate:", formattedRate);
    setrewardRate(formattedRate.toString());

    const stakedBal = await Factory.stakedBalance(address);
    const formattedbalance = ethers.formatUnits(stakedBal, decimals);
    console.log("Reward Rate:", formattedRate);
    console.log("Staled Balance:", stakedBal.toString());
    setStakedAmount(formattedbalance.toString());

    const rewards = await Factory.earned(address);
    const formattedRewards = ethers.formatUnits(rewards, decimals);
    console.log("Reward Rate:", formattedRewards);

    setrewards(formattedRewards.toString());
  };

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);

        setState({
          provider,
          account: address,
          balance: ethers.formatEther(balance),
          chainId: network.chainId.toString(),
          isConnected: true,
        });

        //  interacting with a contract
        const contractFactory = new ethers.Contract(
          stakAddres,
          stakabi,
          signer
        );

        const TokenFactory = new ethers.Contract(
          stakTokenAdd,
          stakToken,
          signer
        );
        setstakingContract(contractFactory);
        setstakeContract(TokenFactory);
        console.log(TokenFactory);
        displayHandler(contractFactory, address);
      } catch (error) {
        console.error("Connection error:", error);
      }
    }
  };

  // Handle Chain ID changes
  const handleChainChanged = useCallback(async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        setState((prevState) => ({
          ...prevState,
          provider,
          chainId: network.chainId.toString(),
        }));
        if (network.chainId != 80002) {
          toast.error("unsupported network!", { position: "bottom-left" });
        }
      } catch (error) {
        console.error("Chain change error:", error);
      }
    }
  }, []);

  // approve input change
  const handleApproveInputChange = (e) => {
    setapproveAmount(e.target.value);
  };

  // user stake input token handler
  const userStakInputChangeHandler = (e) => {
    setuserStakInput(e.target.value);
  };

  // Handle Account changes
  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length > 0) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const address = await signer.getAddress();

        setState((prevState) => ({
          ...prevState,
          account: address,
          provider,
          isConnected: true,
        }));
      } catch (error) {
        console.error("Account change error:", error);
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        account: null,
        isConnected: false,
      }));
    }
  }, []);
  useEffect(() => {
    if (window.ethereum) {
      const connected = window.ethereum.isConnected();
      setState((prevState) => ({ ...prevState, isConnected: connected }));

      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.off("chainChanged", handleChainChanged);
        window.ethereum.off("accountsChanged", handleAccountsChanged);
      };
    }
  }, [handleChainChanged, handleAccountsChanged]);

  // approving stak tokens
  const approveStakToken = async (e) => {
    e.preventDefault();
    if (approveAmount <= 0 || isNaN(approveAmount)) {
      toast.error("token must be non zero value 😥", {
        position: "bottom-left",
      });
      return;
    }

    const amountInWei = ethers.parseUnits(approveAmount, 18);
    console.log(amountInWei);
    try {
      const approval = await stakeContract.approve(
        stakingContract.target,
        amountInWei,
        { gasLimit: 300000 }
      );

      toast.promise(approval.wait(), {
        loading: "Processing...",
        success: "approvel is successfull!",
        error: "approval is cancheled",
      });
      // setapproveAmount("");
    } catch (error) {
      console.log("gettting error to fetch balance");
      console.log(error.massage);
    }
  };

  // submiting stak token
  const stakTokenHandler = async (e) => {
    e.preventDefault();
    console.log(userStakInput);
    try {
      if (userStakInput <= 0 || isNaN(userStakInput)) {
        toast.error("Token Must Be Non Zero 😥");
        return;
      }
      const amountInWei = ethers.parseUnits(userStakInput, 18);
      console.log(amountInWei);
      const staking = await stakingContract.stake(amountInWei);
      toast.promise(staking.wait(), {
        loading: "Processing...",
        success: "  you staked successfully 👍",
        error: "transaction failed 😢",
      });
    } catch (error) {
      console.log("something went wrong in staking");
      console.log(error.massage);
    }
  };
  // claiming the rewards
  const claimTokens = async () => {
    try {
      const claming = await stakingContract.getReward({ gasLimit: 300000 });
      toast.promise(claming.wait(), {
        loading: "Processing...",
        success: "  you claimed successfully 👍",
        error: "transaction failed 😢",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // withdraw input handler
  const withdrawInputChangeHandler = async (e) => {
    setwithdrawInput(e.target.value);
  };
  // withdrawing the tokens
  const withdrawTokens = async (e) => {
    e.preventDefault();
    console.log(withdrawInput);
    try {
      if (withdrawInput <= 0 || isNaN(withdrawInput)) {
        toast.error("Token Must Be Non Zero 😥");
        return;
      }
      const amountInWei = ethers.parseUnits(withdrawInput, 18);
      console.log(amountInWei);
      const withdrawing = await stakingContract.withdrawStakedTokens(
        amountInWei
      );
      toast.promise(withdrawing.wait(), {
        loading: "Processing...",
        success: "  you withdrawed successfully 👍",
        error: "transaction failed 😢",
      });
    } catch (error) {
      console.log("something went wrong in withdrawing");
      console.log(error.massage);
    }
  };

  return (
    <MyContext.Provider
      value={{
        connectWallet,
        state,
        rewardRate,
        stakedAmount,
        rewards,
        approveAmount,
        handleApproveInputChange,
        approveStakToken,
        userStakInput,
        userStakInputChangeHandler,
        stakTokenHandler,
        claimTokens,
        withdrawInput,
        withdrawInputChangeHandler,
        withdrawTokens,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
